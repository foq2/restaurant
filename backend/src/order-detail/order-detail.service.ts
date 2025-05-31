import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(orderId: string, foodId: string, quantity: number) {
    console.log('Creating order detail:', {
      orderId,
      foodId,
      quantity,
    });
    try {
      const orderDetail = await this.prismaService.orderDetail.create({
        data: {
          orderId: Number(orderId),
          foodId: Number(foodId),
          quantity: quantity,
        },
      });
      return orderDetail;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByOrderId(id: string) {
    const orderDetails = await this.prismaService.orderDetail.findMany({
      where: {
        orderId: Number(id),
      },
    });
    return orderDetails;
  }

  async update(id: string, quantity: number) {
    const orderDetail = await this.prismaService.orderDetail.update({
      where: {
        id: Number(id),
      },
      data: {
        quantity: { set: quantity },
      },
    });
    return orderDetail;
  }

  async remove(id: string) {
    const orderDetail = await this.prismaService.orderDetail.delete({
      where: {
        id: Number(id),
      },
    });
    return orderDetail;
  }
}
