import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ApprovalAction } from '../../common/enums';
import { PaymentRequest } from './payment-request.entity';

@Entity('payment_approvals')
export class PaymentApproval extends BaseEntity {
  @Column({ name: 'approval_level' })
  approvalLevel: number;

  @Column({ type: 'enum', enum: ApprovalAction })
  action: ApprovalAction;

  @Column({ name: 'approver_id' })
  approverId: string;

  @Column({ name: 'approver_name' })
  approverName: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'payment_request_id' })
  paymentRequestId: string;

  @ManyToOne(() => PaymentRequest, (pr) => pr.approvals)
  @JoinColumn({ name: 'payment_request_id' })
  paymentRequest: PaymentRequest;
}
