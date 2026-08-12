import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { BankAgency } from './bank-agency.entity';
import { Currency } from '../../common/enums';

@Entity('bank_accounts')
export class BankAccount extends BaseEntity {
  @Column({ name: 'account_number', unique: true })
  accountNumber: string;

  @Column({ nullable: true })
  rib: string;

  @Column({ nullable: true })
  iban: string;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'current_balance', default: 0 })
  currentBalance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'available_balance', default: 0 })
  availableBalance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'forecasted_balance', default: 0 })
  forecastedBalance: number;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'agency_id' })
  agencyId: string;

  @ManyToOne(() => BankAgency, (a) => a.accounts)
  @JoinColumn({ name: 'agency_id' })
  agency: BankAgency;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'group_id' })
  groupId: string;
}
