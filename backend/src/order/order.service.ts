import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '../enum';
@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const orders = await this.prismaService.order.findMany({
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
  async create(userId: string, description: string, status: string) {
    const orderStatus = OrderStatus[status as keyof typeof OrderStatus];
    const order = await this.prismaService.order.create({
      data: {
        description: description,
        status: orderStatus,
        createAt: new Date(),
        userId: Number(userId),
      },
    });
    return order;
  }
  async update(id: string, description: string, status: string) {
    const existing = await this.prismaService.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existing) {
      throw new BadRequestException('Order không tồn tại');
    }
    const orderStatus = OrderStatus[status as keyof typeof OrderStatus];
    const order = await this.prismaService.order.update({
      where: {
        id: Number(id),
      },
      data: {
        description: description,
        status: orderStatus,
      },
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
