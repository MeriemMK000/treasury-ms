import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { BankingLine } from './entities/banking-line.entity';
import { CommitmentMaturity } from './entities/commitment-maturity.entity';
import { UnpaidItem } from './entities/unpaid-item.entity';
import { CommitmentStatus } from '../common/enums';

@Injectable()
export class CommitmentsService {
  constructor(
    @InjectRepository(BankingLine) private lineRepo: Repository<BankingLine>,
    @InjectRepository(CommitmentMaturity) private matRepo: Repository<CommitmentMaturity>,
    @InjectRepository(UnpaidItem) private unpaidRepo: Repository<UnpaidItem>,
  ) {}

  // Banking Lines
  async createLine(data: Partial<BankingLine>) {
    const line = this.lineRepo.create(data);
    line.availableAmount = Number(line.authorizedAmount) - Number(line.usedAmount || 0);
    line.reference = data.reference || `LIG-${Date.now().toString(36).toUpperCase()}`;
    return this.lineRepo.save(line);
  }

  async findAllLines(groupId: string, filters?: { businessUnitId?: string; bankId?: string; type?: string; status?: CommitmentStatus }) {
    const qb = this.lineRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.maturities', 'm')
      .where('l.groupId = :groupId', { groupId });
    if (filters?.businessUnitId) qb.andWhere('l.businessUnitId = :buId', { buId: filters.businessUnitId });
    if (filters?.bankId) qb.andWhere('l.bankId = :bankId', { bankId: filters.bankId });
    if (filters?.type) qb.andWhere('l.type = :type', { type: filters.type });
    if (filters?.status) qb.andWhere('l.status = :status', { status: filters.status });
    return qb.orderBy('l.expiryDate', 'ASC').getMany();
  }

  async findLineById(id: string) {
    const line = await this.lineRepo.findOne({ where: { id }, relations: ['maturities'] });
    if (!line) throw new NotFoundException('Ligne bancaire non trouvée');
    return line;
  }

  async updateLineUsage(id: string, usedAmount: number) {
    const line = await this.findLineById(id);
    line.usedAmount = usedAmount;
    line.availableAmount = Number(line.authorizedAmount) - usedAmount;
    return this.lineRepo.save(line);
  }

  async getExpiringLines(groupId: string, days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.lineRepo.find({
      where: { groupId, status: CommitmentStatus.ACTIF, expiryDate: LessThanOrEqual(futureDate) },
      order: { expiryDate: 'ASC' },
    });
  }

  async getLinesSummary(groupId: string) {
    return this.lineRepo.createQueryBuilder('l')
      .select('l.type', 'type')
      .addSelect('SUM(l.authorizedAmount)', 'totalAuthorized')
      .addSelect('SUM(l.usedAmount)', 'totalUsed')
      .addSelect('SUM(l.availableAmount)', 'totalAvailable')
      .addSelect('COUNT(*)', 'count')
      .where('l.groupId = :groupId AND l.status = :status', { groupId, status: CommitmentStatus.ACTIF })
      .groupBy('l.type')
      .getRawMany();
  }

  // Maturities
  async createMaturity(data: Partial<CommitmentMaturity>) {
    return this.matRepo.save(this.matRepo.create(data));
  }

  async getUpcomingMaturities(groupId: string, days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.matRepo.find({
      where: { groupId, isPaid: false, dueDate: LessThanOrEqual(futureDate) },
      relations: ['bankingLine'],
      order: { dueDate: 'ASC' },
    });
  }

  async markMaturityPaid(id: string) {
    const mat = await this.matRepo.findOne({ where: { id } });
    if (!mat) throw new NotFoundException('Échéance non trouvée');
    mat.isPaid = true;
    mat.paidDate = new Date();
    return this.matRepo.save(mat);
  }

  // Unpaid
  async createUnpaid(data: Partial<UnpaidItem>) {
    return this.unpaidRepo.save(this.unpaidRepo.create({
      ...data, reference: `IMP-${Date.now().toString(36).toUpperCase()}`,
    }));
  }

  async findAllUnpaid(groupId: string) {
    return this.unpaidRepo.find({ where: { groupId, isResolved: false }, order: { originalDueDate: 'ASC' } });
  }

  async resolveUnpaid(id: string, note: string) {
    const item = await this.unpaidRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Impayé non trouvé');
    item.isResolved = true;
    item.resolutionDate = new Date();
    item.resolutionNote = note;
    return this.unpaidRepo.save(item);
  }

  async getAlerts(groupId: string) {
    const [expiringLines, upcomingMaturities, unpaidItems] = await Promise.all([
      this.getExpiringLines(groupId),
      this.getUpcomingMaturities(groupId),
      this.findAllUnpaid(groupId),
    ]);
    return { expiringLines, upcomingMaturities, unpaidItems,
      totalAlerts: expiringLines.length + upcomingMaturities.length + unpaidItems.length };
  }
}
