import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PpiItem } from './entities/ppi-item.entity';
import { ImportOperation } from './entities/import-operation.entity';
import { ImportDocument } from './entities/import-document.entity';
import { InternationalService } from './international.service';
import { InternationalController } from './international.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PpiItem, ImportOperation, ImportDocument])],
  controllers: [InternationalController],
  providers: [InternationalService],
  exports: [InternationalService],
})
export class InternationalModule {}
