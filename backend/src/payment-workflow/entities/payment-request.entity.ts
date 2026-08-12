import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { PaymentRequestStatus, OperationNature, Currency } from '../../common/enums';
import { PaymentApproval } from './payment-approval.entity';

@Entity('payment_requests')
export class PaymentRequest extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @Column({ type: 'enum', enum: PaymentRequestStatus, default: PaymentRequestStatus.BROUILLON })
  status: PaymentRequestStatus;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ type: 'enum', enum: OperationNature })
  paymentMethod: OperationNature;

  @Column({ name: 'beneficiary_name' })
  beneficiaryName: string;

  @Column({ name: 'beneficiary_account', nullable: true })
  beneficiaryAccount: string;

  @Column({ name: 'beneficiary_bank', nullable: true })
  beneficiaryBank: string;

  @Column({ nullable: true })
  motif: string;

  @Column({ name: 'requested_date', type: 'date' })
  requestedDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'project_code', nullable: true })
  projectCode: string;

  @Column({ name: 'requested_by' })
  requestedBy: string;

  @Column({ name: 'current_approval_level', default: 0 })
  currentApprovalLevel: number;

  @Column({ name: 'max_approval_level', default: 1 })
  maxApprovalLevel: number;

  @Column({ name: 'linked_operation_id', nullable: true })
  linkedOperationId: string;

  @Column({ type: 'jsonb', nullable: true })
  printData: Record<string, any>;

  @OneToMany(() => PaymentApproval, (a) => a.paymentRequest)
  approvals: PaymentApproval[];
}
