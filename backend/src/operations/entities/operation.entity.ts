import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { OperationType, OperationNature, OperationStatus, Currency } from '../../common/enums';
import { BankAccount } from '../../banks/entities/bank-account.entity';
import { BankFee } from './bank-fee.entity';

@Entity('operations')
export class Operation extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType;

  @Column({ type: 'enum', enum: OperationNature })
  nature: OperationNature;

  @Column({ type: 'enum', enum: OperationStatus, default: OperationStatus.BROUILLON })
  status: OperationStatus;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ name: 'operation_date', type: 'date' })
  operationDate: Date;

  @Column({ name: 'value_date', type: 'date', nullable: true })
  valueDate: Date;

  @Column({ name: 'positioning_date', type: 'date', nullable: true })
  positioningDate: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'counterparty_name', nullable: true })
  counterpartyName: string;

  @Column({ name: 'counterparty_id', nullable: true })
  counterpartyId: string;

  @Column({ name: 'payment_ref', nullable: true })
  paymentRef: string;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'project_code', nullable: true })
  projectCode: string;

  @Column({ name: 'affair_ref', nullable: true })
  affairRef: string;

  @Column({ name: 'is_positioned', default: false })
  isPositioned: boolean;

  @Column({ name: 'is_cleared', default: false })
  isCleared: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => BankFee, (f) => f.operation)
  fees: BankFee[];
}
