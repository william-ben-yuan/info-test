import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'vehicle-list',
  templateUrl: './list.html',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./list.css'],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(
    private service: VehicleService,
    private router: Router,
    private cdr: ChangeDetectorRef, // Injetado para forçar a detecção de mudanças após carregar os dados
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe((data) => {
      this.vehicles = data;
      this.cdr.detectChanges();
    });
  }

  edit(id: number): void {
    this.router.navigate(['/vehicles', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('Confirma exclusão?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
