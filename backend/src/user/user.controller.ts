import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAll();
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }
  @Post()
  async create(
    @Body()
    body: {
      username: string;
      password: string;
      name: string;
      email: string;
      phone: string;
    },
  ) {
    return this.userService.create(
      body.username,
      body.password,
      body.name,
      body.email,
      body.phone,
    );
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      username: string;
      password: string;
      name: string;
      email: string;
      phone: string;
      role: string;
    },
  ) {
    return this.userService.update(
      id,
      body.username,
      body.password,
      body.name,
      body.email,
      body.phone,
      body.role,
    );
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
