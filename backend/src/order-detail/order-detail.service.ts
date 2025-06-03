import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDetailDto, UpdateOrderDetailDto } from './order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateOrderDetailDto) {
    try {
      const orderDetail = await this.prismaService.orderDetail.create({
        data: dto,
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

  async update(id: string, dto: UpdateOrderDetailDto) {
    const orderDetail = await this.prismaService.orderDetail.update({
      where: {
        id: Number(id),
      },
      data: dto,
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
