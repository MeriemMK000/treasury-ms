import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Currency } from '../../common/enums';

@Entity('forecast_items')
export class ForecastItem extends BaseEntity {
  @Column()
  label: string;

  @Column()
  category: string;

  @Column({ name: 'sub_category', nullable: true })
  subCategory: string;

  @Column({ type: 'enum', enum: ['inflow', 'outflow'] as any })
  direction: 'inflow' | 'outflow';

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.DZD })
  currency: Currency;

  @Column({ name: 'expected_date', type: 'date' })
  expectedDate: Date;

  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_pattern', nullable: true })
  recurrencePattern: string;

  @Column({ nullable: true })
  source: string;

  @Column({ name: 'business_unit_id', nullable: true })
  businessUnitId: string;

  @Column({ name: 'project_code', nullable: true })
  projectCode: string;

  @Column({ name: 'is_confirmed', default: false })
  isConfirmed: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'probability_pct', default: 100 })
  probabilityPct: number;

  @Column({ name: 'forecast_id' })
  forecastId: string;

  @ManyToOne(() => CashForecast, (f) => f.items)
  @JoinColumn({ name: 'forecast_id' })
  forecast: CashForecast;
}
