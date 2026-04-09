import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'vehicle-form',
  templateUrl: './form.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrls: ['./form.css'],
})
export class VehicleFormComponent implements OnChanges {
  @Input() vehicle: Vehicle | null = null;
  @Output() save = new EventEmitter<Vehicle>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      placa: ['', Validators.required],
      chassi: ['', Validators.required],
      renavam: ['', Validators.required],
      modelo: ['', Validators.required],
      marca: ['', Validators.required],
      ano: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.vehicle) {
      this.form.patchValue(this.vehicle);
    } else {
      this.form.reset();
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.save.emit({ ...this.vehicle, ...this.form.value });
  }
}
