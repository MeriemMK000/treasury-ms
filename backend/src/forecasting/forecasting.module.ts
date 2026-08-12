import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashForecast } from './entities/cash-forecast.entity';
import { ForecastItem } from './entities/forecast-item.entity';
import { ForecastingService } from './forecasting.service';
import { ForecastingController } from './forecasting.controller';
import { BanksModule } from '../banks/banks.module';
import { CommitmentsModule } from '../commitments/commitments.module';

@Module({
  imports: [TypeOrmModule.forFeature([CashForecast, ForecastItem]), BanksModule, CommitmentsModule],
  controllers: [ForecastingController],
  providers: [ForecastingService],
  exports: [ForecastingService],
})
export class ForecastingModule {}
