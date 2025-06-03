import { IsNumber } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  foodId: number;

  @IsNumber()
  quantity: number;
}

export class UpdateOrderDetailDto {
  @IsNumber()
  quantity: number;
}
