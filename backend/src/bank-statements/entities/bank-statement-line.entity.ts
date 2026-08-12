import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { BankStatement } from './bank-statement.entity';

@Entity('bank_statement_lines')
export class BankStatementLine extends BaseEntity {
  @Column({ name: 'line_number' })
  lineNumber: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'value_date', type: 'date', nullable: true })
  valueDate: Date;

  @Column()
  label: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  debit: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  credit: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, name: 'running_balance', nullable: true })
  runningBalance: number;

  @Column({ name: 'bank_ref', nullable: true })
  bankRef: string;

  @Column({ name: 'matched_operation_id', nullable: true })
  matchedOperationId: string;

  @Column({ name: 'is_matched', default: false })
  isMatched: boolean;

  @Column({ name: 'is_fee', default: false })
  isFee: boolean;

  @Column({ name: 'auto_matched', default: false })
  autoMatched: boolean;

  @Column({ name: 'statement_id' })
  statementId: string;

  @ManyToOne(() => BankStatement, (s) => s.lines)
  @JoinColumn({ name: 'statement_id' })
  statement: BankStatement;
}
