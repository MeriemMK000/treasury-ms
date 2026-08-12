import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRequest } from './entities/payment-request.entity';
import { PaymentApproval } from './entities/payment-approval.entity';
import { PaymentWorkflowService } from './payment-workflow.service';
import { PaymentWorkflowController } from './payment-workflow.controller';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRequest, PaymentApproval]), OperationsModule],
  controllers: [PaymentWorkflowController],
  providers: [PaymentWorkflowService],
  exports: [PaymentWorkflowService],
})
export class PaymentWorkflowModule {}
