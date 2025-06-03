import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (!user || !bcrypt.compare(dto.password, user.password)) {
      throw new BadRequestException('Tên đăng nhập hoặc mật khẩu không đúng');
    }
    return user;
  }

  async register(dto: RegisterDto) {
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
        throw new BadRequestException('Email hoặc tên đăng nhập đã tồn tại');
      }
      dto.password = await bcrypt.hash(
        dto.password,
        Number(process.env.SALROUND),
      );
      const user = await this.prismaService.user.create({
        data: {
          username: dto.username,
          password: dto.password,
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          role: 'EMPLOYEE',
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error during registration:', error);
      throw new BadRequestException('Đăng ký không thành công');
    }
  }
}
