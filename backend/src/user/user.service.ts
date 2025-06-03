import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

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

  async create(dto: CreateUserDto) {
    try {
      const existing = await this.prismaService.user.findFirst({
        where: {
          OR: [
            {
              username: dto.username,
            },
            {
              email: dto.email,
            },
          ],
        },
      });
      if (existing) {
        throw new BadRequestException('Username hoặc Email đã tồn tại');
      }
      dto.password = await bcrypt.hash(
        dto.password,
        Number(process.env.SALROUND) || 10,
      );
      const user = await this.prismaService.user.create({
        data: dto,
      });
      return user;
    } catch (error) {
      console.error('Error during user creation:', error);
      throw new BadRequestException('Tạo người dùng không thành công');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prismaService.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existing) {
      throw new BadRequestException('User không tồn tại');
    }
    if (dto.password) {
      dto.password = await bcrypt.hash(
        dto.password,
        Number(process.env.SALROUND),
      );
    }
    const data = Object.entries(dto).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== null,
    );
    const user = await this.prismaService.user.update({
      where: {
        id: Number(id),
      },
      data: Object.fromEntries(data),
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
