import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessUnit } from './entities/business-unit.entity';
import { BusinessUnitsService } from './business-units.service';
import { BusinessUnitsController } from './business-units.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessUnit])],
  controllers: [BusinessUnitsController],
  providers: [BusinessUnitsService],
  exports: [BusinessUnitsService],
})
export class BusinessUnitsModule {}
