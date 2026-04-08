import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import rabbitmqConfig from '../config/rabbitq.config';
import { VEHICLE_SERVICE } from '../constants';

@Module({
  imports: [
    ConfigModule.forFeature(rabbitmqConfig),
    ClientsModule.registerAsync([
      {
        name: VEHICLE_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get('rabbitmq.url')],
            queue: config.get('rabbitmq.queue'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
