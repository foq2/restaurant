import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateFoodDto {
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Giá món ăn không được để trống' })
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description: string;
}
export class UpdateFoodDto {
  name?: string;
  price?: number;
  description?: string;
}
