import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { BusinessUnitsModule } from './business-units/business-units.module';
import { BanksModule } from './banks/banks.module';
import { OperationsModule } from './operations/operations.module';
import { PaymentWorkflowModule } from './payment-workflow/payment-workflow.module';
import { InternationalModule } from './international/international.module';
import { CommitmentsModule } from './commitments/commitments.module';
import { ForecastingModule } from './forecasting/forecasting.module';
import { BankStatementsModule } from './bank-statements/bank-statements.module';
import { ConsolidationModule } from './consolidation/consolidation.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    GroupsModule,
    BusinessUnitsModule,
    BanksModule,
    OperationsModule,
    PaymentWorkflowModule,
    InternationalModule,
    CommitmentsModule,
    ForecastingModule,
    BankStatementsModule,
    ConsolidationModule,
    ReportsModule,
  ],
})
export class AppModule {}
