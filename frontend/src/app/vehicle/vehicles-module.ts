import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleListComponent } from './components/list/list';
import { VehicleFormComponent } from './components/form/form';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, VehicleListComponent, VehicleFormComponent],
  exports: [VehicleListComponent],
})
export class VehiclesModule {}
