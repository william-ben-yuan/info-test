import { Module } from '@nestjs/common';
import { VehicleEventsController } from './vehicles/vehicles-event.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [VehicleEventsController],
})
export class AppModule {}
