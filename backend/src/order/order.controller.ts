import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  async getAll() {
    return this.orderService.getAll();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.orderService.getOne(id);
  }
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
