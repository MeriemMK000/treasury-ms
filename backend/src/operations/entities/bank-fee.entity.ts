import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { FeeType, Currency } from '../../common/enums';

@Entity('bank_fees')
export class BankFee extends BaseEntity {
  @Column({ type: 'enum', enum: FeeType })
  type: FeeType;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'operation_id', nullable: true })
  operationId: string;

  @ManyToOne(() => Operation, (o) => o.fees, { nullable: true })
  @JoinColumn({ name: 'operation_id' })
  operation: Operation;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @Column({ name: 'is_expected', default: false })
  isExpected: boolean;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'expected_amount', nullable: true })
  expectedAmount: number;

  @Column({ name: 'has_anomaly', default: false })
  hasAnomaly: boolean;

  @Column({ name: 'anomaly_note', nullable: true })
  anomalyNote: string;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;
}
