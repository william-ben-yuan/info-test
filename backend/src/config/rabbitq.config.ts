import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
  queue: 'vehicle_events',
}));
