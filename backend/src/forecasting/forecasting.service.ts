import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CashForecast } from './entities/cash-forecast.entity';
import { ForecastItem } from './entities/forecast-item.entity';
import { BanksService } from '../banks/banks.service';
import { CommitmentsService } from '../commitments/commitments.service';

@Injectable()
export class ForecastingService {
  constructor(
    @InjectRepository(CashForecast) private forecastRepo: Repository<CashForecast>,
    @InjectRepository(ForecastItem) private itemRepo: Repository<ForecastItem>,
    private banksService: BanksService,
    private commitmentsService: CommitmentsService,
  ) {}

  async createForecast(data: Partial<CashForecast>) {
    return this.forecastRepo.save(this.forecastRepo.create(data));
  }

  async findAll(groupId: string, filters?: { businessUnitId?: string; period?: string }) {
    const qb = this.forecastRepo.createQueryBuilder('f')
      .leftJoinAndSelect('f.items', 'i')
      .where('f.groupId = :groupId', { groupId });
    if (filters?.businessUnitId) qb.andWhere('f.businessUnitId = :buId', { buId: filters.businessUnitId });
    if (filters?.period) qb.andWhere('f.period = :period', { period: filters.period });
    return qb.orderBy('f.startDate', 'DESC').getMany();
  }

  async findById(id: string) {
    const f = await this.forecastRepo.findOne({ where: { id }, relations: ['items'] });
    if (!f) throw new NotFoundException('Prévisionnel non trouvé');
    return f;
  }

  async addItem(forecastId: string, data: Partial<ForecastItem>) {
    const item = this.itemRepo.create({ ...data, forecastId });
    const saved = await this.itemRepo.save(item);
    await this.recalculateForecast(forecastId);
    return saved;
  }

  async recalculateForecast(forecastId: string) {
    const forecast = await this.findById(forecastId);
    let totalInflows = 0, totalOutflows = 0;
    for (const item of forecast.items) {
      const weighted = Number(item.amount) * (Number(item.probabilityPct) / 100);
      if (item.direction === 'inflow') totalInflows += weighted;
      else totalOutflows += weighted;
    }
    forecast.totalInflows = totalInflows;
    forecast.totalOutflows = totalOutflows;
    forecast.closingCash = Number(forecast.openingCash) + totalInflows - totalOutflows;
    forecast.isCritical = forecast.closingCash < 0;
    forecast.isSurplus = forecast.closingCash > Number(forecast.openingCash) * 1.5;
    return this.forecastRepo.save(forecast);
  }

  async generateConsolidatedForecast(groupId: string, buIds: string[], startDate: string, endDate: string) {
    const balances = await this.banksService.getConsolidatedBalance(groupId);
    const maturities = await this.commitmentsService.getUpcomingMaturities(groupId, 90);

    const openingCash = balances.reduce((sum: number, b: any) => sum + Number(b.totalAvailable || 0), 0);
    const maturityOutflows = maturities.reduce((sum, m) => sum + Number(m.amount) + Number(m.interestAmount), 0);

    const forecast = await this.createForecast({
      label: `Consolidé ${new Date(startDate).toLocaleDateString('fr-FR')} - ${new Date(endDate).toLocaleDateString('fr-FR')}`,
      period: 'mois' as any,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      openingCash,
      isConsolidated: true,
      consolidatedBuIds: buIds,
      groupId,
    });

    if (maturityOutflows > 0) {
      await this.addItem(forecast.id, {
        label: 'Tombées d\'engagements',
        category: 'engagements',
        direction: 'outflow',
        amount: maturityOutflows,
        expectedDate: new Date(startDate),
        isConfirmed: true,
        probabilityPct: 100,
      });
    }

    return this.findById(forecast.id);
  }

  async getCriticalSituations(groupId: string) {
    return this.forecastRepo.find({ where: { groupId, isCritical: true }, order: { startDate: 'ASC' } });
  }

  async suggestDeficitSolutions(forecastId: string) {
    const forecast = await this.findById(forecastId);
    if (!forecast.isCritical) return { message: 'Pas de déficit détecté', solutions: [] };

    const deficit = Math.abs(Number(forecast.closingCash));
    return {
      deficit,
      solutions: [
        { type: 'credit_spot', label: 'Crédit spot bancaire', description: `Demander un crédit spot de ${deficit.toLocaleString('fr-FR')} DZD`, priority: 'haute' },
        { type: 'decouvert', label: 'Utilisation du découvert autorisé', description: 'Vérifier les lignes de découvert disponibles', priority: 'haute' },
        { type: 'report_paiement', label: 'Report de paiements', description: 'Identifier les paiements reportables dans la période', priority: 'moyenne' },
        { type: 'acceleration_encaissement', label: 'Accélération des encaissements', description: 'Relancer les clients sur les encaissements en retard', priority: 'moyenne' },
        { type: 'escompte', label: 'Escompte d\'effets', description: 'Mobiliser les effets à recevoir par escompte', priority: 'basse' },
      ],
    };
  }
}
