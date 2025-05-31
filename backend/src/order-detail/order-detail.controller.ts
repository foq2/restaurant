import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  create(@Body() body: { orderId: string; foodId: string; quantity: number }) {
    return this.orderDetailService.create(
      body.orderId,
      body.foodId,
      body.quantity,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findByOrderId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() quantity: number) {
    return this.orderDetailService.update(id, quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(id);
  }
}
