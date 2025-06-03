import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString()
  username: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  password: string;
}
export class RegisterDto extends LoginDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  name: string;
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString()
  email: string;
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  phone: string;
}
