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
import { CreateFoodDto, UpdateFoodDto } from './food.dto';

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
  async create(@Body() dto: CreateFoodDto) {
    return this.foodService.create(dto);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    return this.foodService.update(id, dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.foodService.delete(id);
  }
}
