import { Injectable } from '@nestjs/common';
import { OperationsService } from '../operations/operations.service';
import { BanksService } from '../banks/banks.service';
import { CommitmentsService } from '../commitments/commitments.service';
import { InternationalService } from '../international/international.service';
import { OperationType } from '../common/enums';

@Injectable()
export class ReportsService {
  constructor(
    private opsService: OperationsService,
    private banksService: BanksService,
    private commitmentsService: CommitmentsService,
    private intlService: InternationalService,
  ) {}

  async getDashboardData(groupId: string) {
    const [cashPosition, balances, commitmentAlerts, lcExposure, feesSummary] = await Promise.all([
      this.opsService.getCashPosition(groupId),
      this.banksService.getConsolidatedBalance(groupId),
      this.commitmentsService.getAlerts(groupId),
      this.intlService.getLCExposure(groupId),
      this.opsService.getFeesSummary(groupId),
    ]);

    return { cashPosition, balances, commitmentAlerts, lcExposure, feesSummary };
  }

  async getCashEvolution(groupId: string, startDate: string, endDate: string) {
    const [encaissements, decaissements] = await Promise.all([
      this.opsService.getOperationsByPeriod(groupId, startDate, endDate, OperationType.ENCAISSEMENT),
      this.opsService.getOperationsByPeriod(groupId, startDate, endDate, OperationType.DECAISSEMENT),
    ]);
    return { encaissements, decaissements };
  }

  async getOperationsByEntity(groupId: string, startDate?: string, endDate?: string) {
    const ops = await this.opsService.findAll(groupId, { dateFrom: startDate, dateTo: endDate, page: 1, limit: 10000 });
    const byEntity: Record<string, { encaissements: number; decaissements: number; count: number }> = {};
    for (const op of ops.data) {
      const key = op.businessUnitId;
      if (!byEntity[key]) byEntity[key] = { encaissements: 0, decaissements: 0, count: 0 };
      if (op.type === OperationType.ENCAISSEMENT) byEntity[key].encaissements += Number(op.amount);
      else byEntity[key].decaissements += Number(op.amount);
      byEntity[key].count++;
    }
    return byEntity;
  }

  async getTopPayments(groupId: string, limit: number = 20) {
    const result = await this.opsService.findAll(groupId, {
      type: OperationType.DECAISSEMENT,
      sortBy: 'amount',
      sortOrder: 'DESC',
      page: 1,
      limit,
    });
    return result.data;
  }

  async getOperationsByNature(groupId: string) {
    const ops = await this.opsService.findAll(groupId, { page: 1, limit: 10000 });
    const byNature: Record<string, number> = {};
    for (const op of ops.data) {
      byNature[op.nature] = (byNature[op.nature] || 0) + Number(op.amount);
    }
    return byNature;
  }
}
