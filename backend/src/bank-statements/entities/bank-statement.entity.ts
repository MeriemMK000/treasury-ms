import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { BankStatementLine } from './bank-statement-line.entity';

@Entity('bank_statements')
export class BankStatement extends BaseEntity {
  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @Column({ name: 'statement_date', type: 'date' })
  statementDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'opening_balance', default: 0 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'closing_balance', default: 0 })
  closingBalance: number;

  @Column({ name: 'total_lines', default: 0 })
  totalLines: number;

  @Column({ name: 'processed_lines', default: 0 })
  processedLines: number;

  @Column({ name: 'is_processed', default: false })
  isProcessed: boolean;

  @Column({ name: 'group_id' })
  groupId: string;

  @OneToMany(() => BankStatementLine, (l) => l.statement)
  lines: BankStatementLine[];
}
