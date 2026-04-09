import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { VehicleFormComponent } from '../form/form';

@Component({
  selector: 'vehicle-list',
  templateUrl: './list.html',
  standalone: true,
  imports: [CommonModule, VehicleFormComponent],
  styleUrls: ['./list.css'],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selected: Vehicle | null = null;
  showForm = false;

  constructor(private service: VehicleService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe((data) => (this.vehicles = data));
  }

  newVehicle(): void {
    this.selected = null;
    this.showForm = true;
  }

  edit(vehicle: Vehicle): void {
    this.selected = { ...vehicle };
    this.showForm = true;
  }

  delete(id: number): void {
    if (!confirm('Confirma exclusão?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }

  onSave(vehicle: Vehicle): void {
    const op = vehicle.id ? this.service.update(vehicle.id, vehicle) : this.service.create(vehicle);

    op.subscribe(() => {
      this.showForm = false;
      this.load();
    });
  }

  onCancel(): void {
    this.showForm = false;
  }
}
