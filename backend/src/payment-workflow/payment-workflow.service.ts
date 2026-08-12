import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRequest } from './entities/payment-request.entity';
import { PaymentApproval } from './entities/payment-approval.entity';
import { OperationsService } from '../operations/operations.service';
import { PaymentRequestStatus, ApprovalAction, OperationType, OperationStatus } from '../common/enums';

@Injectable()
export class PaymentWorkflowService {
  constructor(
    @InjectRepository(PaymentRequest) private prRepo: Repository<PaymentRequest>,
    @InjectRepository(PaymentApproval) private paRepo: Repository<PaymentApproval>,
    private opsService: OperationsService,
  ) {}

  private generateRef(): string {
    return `PAY-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
  }

  async create(data: Partial<PaymentRequest>): Promise<PaymentRequest> {
    const pr = this.prRepo.create({ ...data, reference: data.reference || this.generateRef() });
    return this.prRepo.save(pr);
  }

  async findAll(groupId: string, filters?: { status?: PaymentRequestStatus; businessUnitId?: string }) {
    const where: any = { groupId };
    if (filters?.status) where.status = filters.status;
    if (filters?.businessUnitId) where.businessUnitId = filters.businessUnitId;
    return this.prRepo.find({ where, relations: ['approvals'], order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const pr = await this.prRepo.findOne({ where: { id }, relations: ['approvals'] });
    if (!pr) throw new NotFoundException('Demande de paiement non trouvée');
    return pr;
  }

  async submit(id: string): Promise<PaymentRequest> {
    const pr = await this.findById(id);
    if (pr.status !== PaymentRequestStatus.BROUILLON) throw new BadRequestException('Statut invalide pour soumission');
    pr.status = PaymentRequestStatus.SOUMIS;
    pr.currentApprovalLevel = 1;
    return this.prRepo.save(pr);
  }

  async approve(id: string, approverId: string, approverName: string, action: ApprovalAction, comment?: string) {
    const pr = await this.findById(id);
    if (pr.status !== PaymentRequestStatus.SOUMIS && pr.status !== PaymentRequestStatus.EN_VALIDATION) {
      throw new BadRequestException('Demande non en attente de validation');
    }

    const approval = this.paRepo.create({
      paymentRequestId: id, approverId, approverName, action, comment,
      approvalLevel: pr.currentApprovalLevel,
    });
    await this.paRepo.save(approval);

    if (action === ApprovalAction.REJETE) {
      pr.status = PaymentRequestStatus.REJETE;
    } else if (action === ApprovalAction.APPROUVE) {
      if (pr.currentApprovalLevel >= pr.maxApprovalLevel) {
        pr.status = PaymentRequestStatus.VALIDE;
      } else {
        pr.currentApprovalLevel += 1;
        pr.status = PaymentRequestStatus.EN_VALIDATION;
      }
    }

    return this.prRepo.save(pr);
  }

  async execute(id: string, userId: string): Promise<PaymentRequest> {
    const pr = await this.findById(id);
    if (pr.status !== PaymentRequestStatus.VALIDE) throw new BadRequestException('Demande non validée');

    const operation = await this.opsService.create({
      type: OperationType.DECAISSEMENT,
      nature: pr.paymentMethod,
      amount: pr.amount,
      currency: pr.currency,
      operationDate: new Date(),
      counterpartyName: pr.beneficiaryName,
      bankAccountId: pr.bankAccountId,
      businessUnitId: pr.businessUnitId,
      groupId: pr.groupId,
      status: OperationStatus.VALIDE,
      description: pr.motif,
      projectCode: pr.projectCode,
      createdBy: userId,
    });

    pr.status = PaymentRequestStatus.EXECUTE;
    pr.linkedOperationId = operation.id;
    return this.prRepo.save(pr);
  }

  async getPendingCount(groupId: string) {
    return this.prRepo.count({
      where: [
        { groupId, status: PaymentRequestStatus.SOUMIS },
        { groupId, status: PaymentRequestStatus.EN_VALIDATION },
      ],
    });
  }
}
