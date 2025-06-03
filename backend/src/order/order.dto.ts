import { IsString, IsNumber, IsEnum } from 'class-validator';
import { OrderStatus } from '../enum';
export class CreateOrderDto {
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status: OrderStatus;

  @IsNumber()
  userId: number;

  @IsString()
  description: string;
}
export class UpdateOrderDto {
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status: OrderStatus;

  @IsString()
  description: string;
}
