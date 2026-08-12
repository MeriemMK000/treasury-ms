import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { BankFee } from './entities/bank-fee.entity';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { BanksModule } from '../banks/banks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, BankFee]), BanksModule],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
