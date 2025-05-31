import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FoodService } from './food.service';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Get()
  async getAll() {
    return this.foodService.getAll();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.foodService.getOne(id);
  }
  @Post()
  async create(
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
    },
  ) {
    return this.foodService.create(body.name, body.price, body.description);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      price: number;
      description: string;
    },
  ) {
    return this.foodService.update(id, body.name, body.price, body.description);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.foodService.delete(id);
  }
}
