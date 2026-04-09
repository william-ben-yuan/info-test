import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/alert/alert';
import { LayoutComponent } from '../../../../shared/components/layout/layout';

@Component({
  selector: 'vehicle-list',
  templateUrl: './list.html',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertComponent, LayoutComponent],
  styleUrls: ['./list.css'],
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  errorMessage: string | null = null;

  constructor(
    private service: VehicleService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.errorMessage = null;
    this.service.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erro ao carregar veículos.';
        this.cdr.detectChanges();
      },
    });
  }

  edit(id: number): void {
    this.router.navigate(['/vehicles', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('Confirma exclusão?')) return;
    this.service.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erro ao excluir veículo.';
        this.cdr.detectChanges();
      },
    });
  }
}
