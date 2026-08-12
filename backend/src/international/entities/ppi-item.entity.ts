import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Currency } from '../../common/enums';

@Entity('ppi_items')
export class PpiItem extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @Column()
  description: string;

  @Column({ name: 'supplier_name' })
  supplierName: string;

  @Column({ name: 'supplier_country', nullable: true })
  supplierCountry: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ type: 'decimal', precision: 10, scale: 4, name: 'exchange_rate', nullable: true })
  exchangeRate: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'amount_dzd', nullable: true })
  amountDzd: number;

  @Column({ name: 'ppi_year' })
  ppiYear: number;

  @Column({ name: 'is_validated', default: false })
  isValidated: boolean;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'used_by_operation_id', nullable: true })
  usedByOperationId: string;

  @Column({ name: 'validation_date', type: 'date', nullable: true })
  validationDate: Date;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'product_category', nullable: true })
  productCategory: string;

  @Column({ name: 'tariff_code', nullable: true })
  tariffCode: string;
}
