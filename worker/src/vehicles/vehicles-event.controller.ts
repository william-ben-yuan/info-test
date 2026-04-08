import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class VehicleEventsController {
  private readonly logger = new Logger(VehicleEventsController.name);

  @EventPattern('vehicle_created')
  handleCreated(@Payload() data: any) {
    this.logger.log(`[CREATED] id=${data.id} placa=${data.placa}`);
  }

  @EventPattern('vehicle_updated')
  handleUpdated(@Payload() data: any) {
    this.logger.log(`[UPDATED] id=${data.id} placa=${data.placa}`);
  }

  @EventPattern('vehicle_removed')
  handleRemoved(@Payload() data: any) {
    this.logger.log(`[REMOVED] id=${data.id}`);
  }
}
