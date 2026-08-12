import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsolidationModel } from './entities/consolidation-model.entity';
import { ConsolidationService } from './consolidation.service';
import { ConsolidationController } from './consolidation.controller';
import { BanksModule } from '../banks/banks.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConsolidationModel]), BanksModule, OperationsModule],
  controllers: [ConsolidationController],
  providers: [ConsolidationService],
  exports: [ConsolidationService],
})
export class ConsolidationModule {}
