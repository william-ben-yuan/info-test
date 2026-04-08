import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './vehicle.entity';

const mockVehicle: Vehicle = {
  id: 1,
  placa: 'ABC1234',
  chassi: '9BWZZZ377VT004251',
  renavam: '12345678901',
  marca: 'Toyota',
  modelo: 'Corolla',
  ano: 2022,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repo: jest.Mocked<Repository<Vehicle>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    repo = module.get(getRepositoryToken(Vehicle));
  });

  describe('create', () => {
    it('cria e retorna o veículo quando não há duplicata', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockVehicle);
      repo.save.mockResolvedValue(mockVehicle);

      const result = await service.create({
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2022,
      });

      expect(repo.findOne).toHaveBeenCalledWith({
        where: [
          { placa: 'ABC1234' },
          { chassi: '9BWZZZ377VT004251' },
          { renavam: '12345678901' },
        ],
      });
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(mockVehicle);
    });

    it('lança ConflictException quando placa/chassi/renavam já existe', async () => {
      repo.findOne.mockResolvedValue(mockVehicle);

      await expect(
        service.create({
          placa: 'ABC1234',
          chassi: '9BWZZZ377VT004251',
          renavam: '12345678901',
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 2022,
        }),
      ).rejects.toThrow(ConflictException);

      expect(repo.create).not.toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('retorna lista de veículos', async () => {
      repo.find.mockResolvedValue([mockVehicle]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual([mockVehicle]);
    });

    it('retorna lista vazia quando não há veículos', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('retorna o veículo pelo id', async () => {
      repo.findOne.mockResolvedValue(mockVehicle);

      const result = await service.findOne(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockVehicle);
    });

    it('lança NotFoundException quando veículo não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(99)).rejects.toThrow('99');
    });

    it('converte id para Number ao buscar', async () => {
      repo.findOne.mockResolvedValue(mockVehicle);

      await service.findOne('1' as unknown as number);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('atualiza e retorna o veículo', async () => {
      const updated = { ...mockVehicle, modelo: 'Camry' };
      repo.findOne.mockResolvedValue(mockVehicle);
      repo.save.mockResolvedValue(updated);

      const result = await service.update(1, { modelo: 'Camry' });

      expect(repo.save).toHaveBeenCalledWith({
        ...mockVehicle,
        modelo: 'Camry',
      });
      expect(result.modelo).toBe('Camry');
    });

    it('lança NotFoundException quando veículo não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update(99, { modelo: 'Camry' })).rejects.toThrow(
        NotFoundException,
      );
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('remove o veículo', async () => {
      repo.findOne.mockResolvedValue(mockVehicle);
      repo.remove.mockResolvedValue(mockVehicle);

      await service.remove(1);

      expect(repo.remove).toHaveBeenCalledWith(mockVehicle);
    });

    it('lança NotFoundException quando veículo não existe', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
      expect(repo.remove).not.toHaveBeenCalled();
    });
  });
});
