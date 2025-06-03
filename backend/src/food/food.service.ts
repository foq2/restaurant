import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto, UpdateFoodDto } from './food.dto';

@Injectable()
export class FoodService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAll() {
    const foods = await this.prismaService.food.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
      },
    });
    return foods;
  }

  async getOne(id: string) {
    const food = await this.prismaService.food.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!food) {
      throw new BadRequestException('Food không tồn tại');
    }
    return food;
  }

  async create(dto: CreateFoodDto) {
    const food = await this.prismaService.food.create({
      data: dto,
    });
    return food;
  }

  async update(id: string, dto: UpdateFoodDto) {
    const existing = await this.prismaService.food.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existing) {
      throw new BadRequestException('Food không tồn tại');
    }
    const food = await this.prismaService.food.update({
      where: {
        id: Number(id),
      },
      data: dto,
    });
    return food;
  }

  async delete(id: string) {
    const food = await this.prismaService.food.delete({
      where: {
        id: Number(id),
      },
    });

    if (!food) {
      throw new BadRequestException('Food không tồn tại');
    }

    return food;
  }
}
