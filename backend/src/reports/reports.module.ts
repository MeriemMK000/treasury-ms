import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { OperationsModule } from '../operations/operations.module';
import { BanksModule } from '../banks/banks.module';
import { CommitmentsModule } from '../commitments/commitments.module';
import { InternationalModule } from '../international/international.module';

@Module({
  imports: [OperationsModule, BanksModule, CommitmentsModule, InternationalModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
