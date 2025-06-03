import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: Role;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Vai trò không hợp lệ' })
  role: Role;
}
