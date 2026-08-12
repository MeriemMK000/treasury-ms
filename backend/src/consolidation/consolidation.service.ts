import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsolidationModel } from './entities/consolidation-model.entity';
import { BanksService } from '../banks/banks.service';

@Injectable()
export class ConsolidationService {
  constructor(
    @InjectRepository(ConsolidationModel) private modelRepo: Repository<ConsolidationModel>,
    private banksService: BanksService,
  ) {}

  async createModel(data: Partial<ConsolidationModel>) { return this.modelRepo.save(this.modelRepo.create(data)); }

  async findAllModels(groupId: string) {
    return this.modelRepo.find({ where: { groupId }, order: { name: 'ASC' } });
  }

  async findModelById(id: string) {
    const m = await this.modelRepo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('Modèle non trouvé');
    return m;
  }

  async executeConsolidation(modelId: string) {
    const model = await this.findModelById(modelId);
    const accounts = await this.banksService.findAllAccounts(model.groupId);
    
    let filtered = accounts;
    if (!model.includeAllAccounts) {
      filtered = accounts.filter(a => {
        if (model.businessUnitIds.length && !model.businessUnitIds.includes(a.businessUnitId)) return false;
        if (model.bankAgencyIds.length && !model.bankAgencyIds.includes(a.agencyId)) return false;
        return true;
      });
    }

    const byCurrency: Record<string, { balance: number; available: number; count: number; accounts: any[] }> = {};
    for (const acc of filtered) {
      if (!byCurrency[acc.currency]) byCurrency[acc.currency] = { balance: 0, available: 0, count: 0, accounts: [] };
      byCurrency[acc.currency].balance += Number(acc.currentBalance);
      byCurrency[acc.currency].available += Number(acc.availableBalance);
      byCurrency[acc.currency].count++;
      byCurrency[acc.currency].accounts.push({ id: acc.id, label: acc.label, balance: acc.currentBalance, available: acc.availableBalance });
    }

    return { model, consolidation: byCurrency, totalAccounts: filtered.length };
  }

  async updateModel(id: string, data: Partial<ConsolidationModel>) {
    await this.modelRepo.update(id, data);
    return this.findModelById(id);
  }
}
