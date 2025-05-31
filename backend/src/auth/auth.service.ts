import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(username: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user || user.password !== password) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng');
    }
    return user;
  }

  async register(
    username: string,
    password: string,
    name: string,
    email: string,
    phone: string,
  ) {
    const existing = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existing) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const user = await this.prismaService.user.create({
      data: {
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
        role: 'EMPLOYEE',
      },
    });
    return user;
  }
}
