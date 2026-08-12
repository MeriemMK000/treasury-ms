import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Currency } from '../../common/enums';

@Entity('unpaid_items')
export class UnpaidItem extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ name: 'original_due_date', type: 'date' })
  originalDueDate: Date;

  @Column({ name: 'counterparty_name' })
  counterpartyName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @Column({ name: 'days_overdue', default: 0 })
  daysOverdue: number;

  @Column({ name: 'is_resolved', default: false })
  isResolved: boolean;

  @Column({ name: 'resolution_date', type: 'date', nullable: true })
  resolutionDate: Date;

  @Column({ name: 'resolution_note', nullable: true })
  resolutionNote: string;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;
}
