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
import { CreateUserDto, UpdateUserDto } from './user.dto';

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
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    console.log('Updating user with ID:', id, 'with data:', dto);
    return this.userService.update(id, dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
