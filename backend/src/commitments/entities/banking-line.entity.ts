import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { CommitmentType, CommitmentStatus, Currency } from '../../common/enums';
import { CommitmentMaturity } from './commitment-maturity.entity';

@Entity('banking_lines')
export class BankingLine extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @Column({ type: 'enum', enum: CommitmentType })
  type: CommitmentType;

  @Column({ type: 'enum', enum: CommitmentStatus, default: CommitmentStatus.ACTIF })
  status: CommitmentStatus;

  @Column()
  label: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'authorized_amount' })
  authorizedAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'used_amount', default: 0 })
  usedAmount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'available_amount', default: 0 })
  availableAmount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'expiry_date', type: 'date' })
  expiryDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate', nullable: true })
  interestRate: number;

  @Column({ name: 'bank_id' })
  bankId: string;

  @Column({ name: 'bank_account_id', nullable: true })
  bankAccountId: string;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'renewal_alert_days', default: 30 })
  renewalAlertDays: number;

  @Column({ name: 'is_renewable', default: false })
  isRenewable: boolean;

  @OneToMany(() => CommitmentMaturity, (m) => m.bankingLine)
  maturities: CommitmentMaturity[];
}
