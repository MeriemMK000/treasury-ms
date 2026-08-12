import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingLine } from './entities/banking-line.entity';
import { CommitmentMaturity } from './entities/commitment-maturity.entity';
import { UnpaidItem } from './entities/unpaid-item.entity';
import { CommitmentsService } from './commitments.service';
import { CommitmentsController } from './commitments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankingLine, CommitmentMaturity, UnpaidItem])],
  controllers: [CommitmentsController],
  providers: [CommitmentsService],
  exports: [CommitmentsService],
})
export class CommitmentsModule {}
