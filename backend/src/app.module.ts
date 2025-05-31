import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FoodModule } from './food/food.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order-detail/order-detail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // để có thể dùng ở bất kỳ đâu trong app
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    FoodModule,
    OrderModule,
    OrderDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
