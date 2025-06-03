import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto, UpdateOrderDetailDto } from './order-detail.dto';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  create(@Body() dto: CreateOrderDetailDto) {
    return this.orderDetailService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findByOrderId(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDetailDto) {
    return this.orderDetailService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(id);
  }
}
