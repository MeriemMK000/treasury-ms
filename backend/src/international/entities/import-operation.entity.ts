import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ImportOperationStatus, Currency } from '../../common/enums';
import { ImportDocument } from './import-document.entity';

@Entity('import_operations')
export class ImportOperation extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @Column({ type: 'enum', enum: ImportOperationStatus, default: ImportOperationStatus.PPI_ENREGISTRE })
  status: ImportOperationStatus;

  @Column()
  description: string;

  @Column({ name: 'supplier_name' })
  supplierName: string;

  @Column({ name: 'supplier_country' })
  supplierCountry: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.USD })
  currency: Currency;

  @Column({ name: 'ppi_item_id', nullable: true })
  ppiItemId: string;

  @Column({ name: 'proforma_ref', nullable: true })
  proformaRef: string;

  @Column({ name: 'proforma_date', type: 'date', nullable: true })
  proformaDate: Date;

  @Column({ name: 'predom_ref', nullable: true })
  predomRef: string;

  @Column({ name: 'predom_date', type: 'date', nullable: true })
  predomDate: Date;

  @Column({ name: 'predom_bank_id', nullable: true })
  predomBankId: string;

  @Column({ name: 'dom_ref', nullable: true })
  domRef: string;

  @Column({ name: 'dom_date', type: 'date', nullable: true })
  domDate: Date;

  @Column({ name: 'dom_bank_id', nullable: true })
  domBankId: string;

  @Column({ name: 'lc_ref', nullable: true })
  lcRef: string;

  @Column({ name: 'lc_type', nullable: true })
  lcType: string;

  @Column({ name: 'lc_opening_date', type: 'date', nullable: true })
  lcOpeningDate: Date;

  @Column({ name: 'lc_expiry_date', type: 'date', nullable: true })
  lcExpiryDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'lc_amount', nullable: true })
  lcAmount: number;

  @Column({ name: 'cil_ref', nullable: true })
  cilRef: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'cil_amount', nullable: true })
  cilAmount: number;

  @Column({ name: 'cil_maturity_date', type: 'date', nullable: true })
  cilMaturityDate: Date;

  @Column({ name: 'doc_collection_type', nullable: true })
  docCollectionType: string;

  @Column({ name: 'doc_collection_due_date', type: 'date', nullable: true })
  docCollectionDueDate: Date;

  @Column({ name: 'shipping_date', type: 'date', nullable: true })
  shippingDate: Date;

  @Column({ name: 'invoice_ref', nullable: true })
  invoiceRef: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'invoice_amount', nullable: true })
  invoiceAmount: number;

  @Column({ name: 'payment_date', type: 'date', nullable: true })
  paymentDate: Date;

  @Column({ name: 'closure_date', type: 'date', nullable: true })
  closureDate: Date;

  @Column({ name: 'bank_account_id', nullable: true })
  bankAccountId: string;

  @Column({ name: 'business_unit_id' })
  businessUnitId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'total_fees', default: 0 })
  totalFees: number;

  @Column({ type: 'jsonb', name: 'fees_detail', nullable: true })
  feesDetail: Record<string, any>[];

  @OneToMany(() => ImportDocument, (d) => d.importOperation)
  documents: ImportDocument[];
}
