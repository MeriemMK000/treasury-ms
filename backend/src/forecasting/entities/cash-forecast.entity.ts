import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ForecastPeriod } from '../../common/enums';
import { ForecastItem } from './forecast-item.entity';

@Entity('cash_forecasts')
export class CashForecast extends BaseEntity {
  @Column()
  label: string;

  @Column({ type: 'enum', enum: ForecastPeriod })
  period: ForecastPeriod;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'opening_cash', default: 0 })
  openingCash: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'total_inflows', default: 0 })
  totalInflows: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'total_outflows', default: 0 })
  totalOutflows: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'closing_cash', default: 0 })
  closingCash: number;

  @Column({ name: 'is_critical', default: false })
  isCritical: boolean;

  @Column({ name: 'is_surplus', default: false })
  isSurplus: boolean;

  @Column({ name: 'surplus_management_enabled', default: false })
  surplusManagementEnabled: boolean;

  @Column({ name: 'business_unit_id', nullable: true })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'is_consolidated', default: false })
  isConsolidated: boolean;

  @Column('uuid', { name: 'consolidated_bu_ids', array: true, default: '{}' })
  consolidatedBuIds: string[];

  @OneToMany(() => ForecastItem, (fi) => fi.forecast)
  items: ForecastItem[];
}
