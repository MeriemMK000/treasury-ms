import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankStatement } from './entities/bank-statement.entity';
import { BankStatementLine } from './entities/bank-statement-line.entity';
import { BankStatementsService } from './bank-statements.service';
import { BankStatementsController } from './bank-statements.controller';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankStatement, BankStatementLine]), OperationsModule],
  controllers: [BankStatementsController],
  providers: [BankStatementsService],
  exports: [BankStatementsService],
})
export class BankStatementsModule {}
