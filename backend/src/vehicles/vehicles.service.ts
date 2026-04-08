import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ClientProxy } from '@nestjs/microservices';
import { VEHICLE_SERVICE } from 'src/constants';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @Inject(VEHICLE_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const existing = await this.vehicleRepository.findOne({
      where: [
        { placa: dto.placa },
        { chassi: dto.chassi },
        { renavam: dto.renavam },
      ],
    });
    if (existing)
      throw new ConflictException(
        'Veículo com placa, chassi ou renavam já cadastrado',
      );

    const vehicle = this.vehicleRepository.create(dto);
    const saved = await this.vehicleRepository.save(vehicle);
    this.client.emit('vehicle_created', saved);
    return saved;
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find();
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo ${id} não encontrado`);
    }

    return vehicle;
  }

  async update(id: number, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    Object.assign(vehicle, dto);
    const saved = await this.vehicleRepository.save(vehicle);
    this.client.emit('vehicle_updated', saved);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
    this.client.emit('vehicle_removed', { id });
  }
}
