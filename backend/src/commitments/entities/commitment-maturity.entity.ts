import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Currency } from '../../common/enums';
import { BankingLine } from './banking-line.entity';

@Entity('commitment_maturities')
export class CommitmentMaturity extends BaseEntity {
  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'interest_amount', default: 0 })
  interestAmount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  @Column({ name: 'paid_date', type: 'date', nullable: true })
  paidDate: Date;

  @Column({ name: 'is_overdue', default: false })
  isOverdue: boolean;

  @Column({ name: 'days_overdue', default: 0 })
  daysOverdue: number;

  @Column({ name: 'banking_line_id' })
  bankingLineId: string;

  @ManyToOne(() => BankingLine, (bl) => bl.maturities)
  @JoinColumn({ name: 'banking_line_id' })
  bankingLine: BankingLine;

  @Column({ name: 'group_id' })
  groupId: string;
}
