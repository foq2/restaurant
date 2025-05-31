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
  async create(
    @Body()
    body: {
      userId: string;
      description: string;
      status: string;
    },
  ) {
    return this.orderService.create(body.userId, body.description, body.status);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      description: string;
      status: string;
    },
  ) {
    return this.orderService.update(id, body.description, body.status);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
