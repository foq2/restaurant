import { Module } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailController } from './order-detail.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
