import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { OrderStatus } from '../enum';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(searchTerm?: string, status?: string, date?: string) {
    const where: any = {};

    if (searchTerm) {
      where.OR = [
        {
          id: isNaN(Number(searchTerm)) ? undefined : Number(searchTerm),
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ].filter((condition) => Object.values(condition)[0] !== undefined);
    }

    if (status && status !== 'ALL') {
      where.status = status as OrderStatus;
    }

    if (date && date !== 'ALL') {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      where.createAt = {
        gte: dateObj,
        lt: nextDay,
      };
    }

    const orders = await this.prismaService.order.findMany({
      where,
      select: {
        id: true,
        description: true,
        status: true,
        createAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createAt: 'desc',
      },
    });
    return orders;
  }

  async getOne(id: string) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        description: true,
        status: true,
        createAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
  async create(dto: CreateOrderDto) {
    const order = await this.prismaService.order.create({
      data: dto,
    });
    return order;
  }
  async update(id: string, dto: UpdateOrderDto) {
    const existing = await this.prismaService.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existing) {
      throw new BadRequestException('Order không tồn tại');
    }
    const order = await this.prismaService.order.update({
      where: {
        id: Number(id),
      },
      data: dto,
    });
    return order;
  }
  async delete(id: string) {
    const order = await this.prismaService.order.delete({
      where: {
        id: Number(id),
      },
    });

    if (!order) {
      throw new BadRequestException('Order không tồn tại');
    }

    return order;
  }
}
