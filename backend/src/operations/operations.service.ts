import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Operation } from './entities/operation.entity';
import { BankFee } from './entities/bank-fee.entity';
import { BanksService } from '../banks/banks.service';
import { OperationType, OperationStatus } from '../common/enums';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation) private opRepo: Repository<Operation>,
    @InjectRepository(BankFee) private feeRepo: Repository<BankFee>,
    private banksService: BanksService,
  ) {}

  private generateRef(type: OperationType): string {
    const prefix = type === OperationType.ENCAISSEMENT ? 'ENC' : 'DEC';
    const ts = Date.now().toString(36).toUpperCase();
    return `${prefix}-${new Date().getFullYear()}-${ts}`;
  }

  async create(data: Partial<Operation>): Promise<Operation> {
    const op = this.opRepo.create({
      ...data,
      reference: data.reference || this.generateRef(data.type),
    });
    return this.opRepo.save(op);
  }

  async findAll(groupId: string, filters: {
    type?: OperationType; status?: OperationStatus; businessUnitId?: string;
    bankAccountId?: string; dateFrom?: string; dateTo?: string;
    search?: string; isPositioned?: boolean;
  } & PaginationDto): Promise<PaginatedResult<Operation>> {
    const qb = this.opRepo.createQueryBuilder('o')
      .leftJoinAndSelect('o.bankAccount', 'ba')
      .leftJoinAndSelect('ba.agency', 'ag')
      .leftJoinAndSelect('ag.bank', 'b')
      .where('o.groupId = :groupId', { groupId });

    if (filters.type) qb.andWhere('o.type = :type', { type: filters.type });
    if (filters.status) qb.andWhere('o.status = :status', { status: filters.status });
    if (filters.businessUnitId) qb.andWhere('o.businessUnitId = :buId', { buId: filters.businessUnitId });
    if (filters.bankAccountId) qb.andWhere('o.bankAccountId = :accId', { accId: filters.bankAccountId });
    if (filters.dateFrom) qb.andWhere('o.operationDate >= :from', { from: filters.dateFrom });
    if (filters.dateTo) qb.andWhere('o.operationDate <= :to', { to: filters.dateTo });
    if (filters.isPositioned !== undefined) qb.andWhere('o.isPositioned = :pos', { pos: filters.isPositioned });
    if (filters.search) qb.andWhere('(o.reference ILIKE :s OR o.counterpartyName ILIKE :s OR o.description ILIKE :s)', { s: `%${filters.search}%` });

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const [data, total] = await qb
      .orderBy(`o.${filters.sortBy || 'operationDate'}`, filters.sortOrder || 'DESC')
      .skip((page - 1) * limit).take(limit).getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<Operation> {
    const op = await this.opRepo.findOne({ where: { id }, relations: ['bankAccount', 'bankAccount.agency', 'bankAccount.agency.bank', 'fees'] });
    if (!op) throw new NotFoundException('Opération non trouvée');
    return op;
  }

  async update(id: string, data: Partial<Operation>): Promise<Operation> {
    await this.opRepo.update(id, data);
    return this.findById(id);
  }

  async positionOperation(id: string): Promise<Operation> {
    const op = await this.findById(id);
    if (op.isPositioned) throw new BadRequestException('Opération déjà positionnée');
    op.isPositioned = true;
    op.positioningDate = new Date();
    op.status = OperationStatus.POSITIONNE;

    const account = await this.banksService.findAccountById(op.bankAccountId);
    const delta = op.type === OperationType.ENCAISSEMENT ? Number(op.amount) : -Number(op.amount);
    await this.banksService.updateAccountBalance(op.bankAccountId, Number(account.currentBalance) + delta);

    return this.opRepo.save(op);
  }

  async getCashPosition(groupId: string, businessUnitId?: string) {
    const qb = this.opRepo.createQueryBuilder('o')
      .select('o.type', 'type')
      .addSelect('o.status', 'status')
      .addSelect('o.isPositioned', 'isPositioned')
      .addSelect('SUM(o.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('o.groupId = :groupId', { groupId })
      .groupBy('o.type').addGroupBy('o.status').addGroupBy('o.isPositioned');

    if (businessUnitId) qb.andWhere('o.businessUnitId = :buId', { buId: businessUnitId });
    return qb.getRawMany();
  }

  async getOperationsByPeriod(groupId: string, startDate: string, endDate: string, type?: OperationType) {
    const qb = this.opRepo.createQueryBuilder('o')
      .select("DATE_TRUNC('day', o.operationDate)", 'date')
      .addSelect('SUM(o.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('o.groupId = :groupId', { groupId })
      .andWhere('o.operationDate BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy("DATE_TRUNC('day', o.operationDate)")
      .orderBy("DATE_TRUNC('day', o.operationDate)", 'ASC');

    if (type) qb.andWhere('o.type = :type', { type });
    return qb.getRawMany();
  }

  // === Fees ===
  async createFee(data: Partial<BankFee>) {
    const fee = this.feeRepo.create(data);
    if (fee.expectedAmount && Math.abs(Number(fee.amount) - Number(fee.expectedAmount)) > 0.01) {
      fee.hasAnomaly = true;
      fee.anomalyNote = `Écart de ${(Number(fee.amount) - Number(fee.expectedAmount)).toFixed(2)} détecté`;
    }
    return this.feeRepo.save(fee);
  }

  async getFees(groupId: string, filters?: { hasAnomaly?: boolean; dateFrom?: string; dateTo?: string }) {
    const qb = this.feeRepo.createQueryBuilder('f')
      .where('f.groupId = :groupId', { groupId });
    if (filters?.hasAnomaly) qb.andWhere('f.hasAnomaly = true');
    if (filters?.dateFrom) qb.andWhere('f.date >= :from', { from: filters.dateFrom });
    if (filters?.dateTo) qb.andWhere('f.date <= :to', { to: filters.dateTo });
    return qb.orderBy('f.date', 'DESC').getMany();
  }

  async getFeesSummary(groupId: string) {
    return this.feeRepo.createQueryBuilder('f')
      .select('f.type', 'type')
      .addSelect('SUM(f.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CASE WHEN f.hasAnomaly THEN 1 ELSE 0 END)', 'anomalies')
      .where('f.groupId = :groupId', { groupId })
      .groupBy('f.type')
      .getRawMany();
  }
}
