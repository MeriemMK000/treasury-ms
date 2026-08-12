import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankStatement } from './entities/bank-statement.entity';
import { BankStatementLine } from './entities/bank-statement-line.entity';
import { OperationsService } from '../operations/operations.service';

@Injectable()
export class BankStatementsService {
  constructor(
    @InjectRepository(BankStatement) private stmtRepo: Repository<BankStatement>,
    @InjectRepository(BankStatementLine) private lineRepo: Repository<BankStatementLine>,
    private opsService: OperationsService,
  ) {}

  async importStatement(data: { bankAccountId: string; statementDate: Date; lines: any[]; openingBalance: number; closingBalance: number; fileName: string; groupId: string }) {
    const stmt = this.stmtRepo.create({
      bankAccountId: data.bankAccountId,
      statementDate: data.statementDate,
      openingBalance: data.openingBalance,
      closingBalance: data.closingBalance,
      totalLines: data.lines.length,
      fileName: data.fileName,
      groupId: data.groupId,
    });
    const saved = await this.stmtRepo.save(stmt);

    for (let i = 0; i < data.lines.length; i++) {
      const line = data.lines[i];
      await this.lineRepo.save(this.lineRepo.create({
        statementId: saved.id,
        lineNumber: i + 1,
        date: line.date,
        valueDate: line.valueDate,
        label: line.label,
        debit: line.debit || 0,
        credit: line.credit || 0,
        runningBalance: line.balance,
        bankRef: line.ref,
      }));
    }

    return this.findById(saved.id);
  }

  async findAll(groupId: string) {
    return this.stmtRepo.find({ where: { groupId }, order: { statementDate: 'DESC' } });
  }

  async findById(id: string) {
    const stmt = await this.stmtRepo.findOne({ where: { id }, relations: ['lines'] });
    if (!stmt) throw new NotFoundException('Relevé non trouvé');
    return stmt;
  }

  async autoMatchLines(statementId: string) {
    const stmt = await this.findById(statementId);
    let matched = 0;

    for (const line of stmt.lines) {
      if (line.isMatched) continue;
      // Auto-match by reference or amount+date
      const ops = await this.opsService.findAll(stmt.groupId, {
        bankAccountId: stmt.bankAccountId,
        search: line.bankRef,
        page: 1, limit: 5,
      });

      if (ops.data.length === 1) {
        const op = ops.data[0];
        const amount = line.credit > 0 ? line.credit : line.debit;
        if (Math.abs(Number(op.amount) - Number(amount)) < 0.01) {
          line.isMatched = true;
          line.autoMatched = true;
          line.matchedOperationId = op.id;
          await this.lineRepo.save(line);
          matched++;
        }
      }
    }

    stmt.processedLines = stmt.lines.filter(l => l.isMatched).length;
    stmt.isProcessed = stmt.processedLines === stmt.totalLines;
    await this.stmtRepo.save(stmt);

    return { matched, total: stmt.totalLines, remaining: stmt.totalLines - stmt.processedLines };
  }

  async matchLine(lineId: string, operationId: string) {
    const line = await this.lineRepo.findOne({ where: { id: lineId } });
    if (!line) throw new NotFoundException('Ligne non trouvée');
    line.isMatched = true;
    line.matchedOperationId = operationId;
    return this.lineRepo.save(line);
  }

  async detectFees(statementId: string) {
    const stmt = await this.findById(statementId);
    const feeKeywords = ['agios', 'commission', 'frais', 'intérêts', 'taxes', 'tva', 'timbre'];
    return stmt.lines.filter(line =>
      feeKeywords.some(kw => line.label.toLowerCase().includes(kw))
    ).map(line => ({ ...line, isFee: true }));
  }
}
