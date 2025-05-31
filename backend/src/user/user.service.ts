import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../enum';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    return users;
  }

  async getOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }
    return user;
  }

  async create(
    username: string,
    password: string,
    name: string,
    email: string,
    phone: string,
  ) {
    const existing = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existing) {
      throw new BadRequestException('Username đã tồn tại');
    }
    const user = await this.prismaService.user.create({
      data: {
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
      },
    });
    return user;
  }

  async update(
    id: string,
    username: string,
    password: string,
    name: string,
    email: string,
    phone: string,
    role: string,
  ) {
    const existing = await this.prismaService.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existing) {
      throw new BadRequestException('Username không tồn tại');
    }
    const userRole = Role[role as keyof typeof Role];
    const user = await this.prismaService.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
        role: userRole,
      },
    });
    return user;
  }

  async delete(id: string) {
    const user = await this.prismaService.user.delete({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      throw new BadRequestException('User không tồn tại');
    }

    return user;
  }
}
