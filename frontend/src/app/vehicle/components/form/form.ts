import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vehicle-form',
  templateUrl: './form.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./form.css'],
})
export class VehicleFormComponent implements OnInit {
  form: FormGroup;
  vehicleId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      placa: ['', Validators.required],
      chassi: ['', Validators.required],
      renavam: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      ano: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleId = +id;
      this.service.getById(this.vehicleId).subscribe((v) => this.form.patchValue(v));
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const payload: Vehicle = { ...this.form.value };

    const op = this.vehicleId
      ? this.service.update(this.vehicleId, payload)
      : this.service.create(payload);

    op.subscribe(() => this.router.navigate(['/vehicles']));
  }

  cancel(): void {
    this.router.navigate(['/vehicles']);
  }
}
