import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { App } from './app';
import { VehicleFormComponent } from './features/vehicle/components/form/form';
import { VehicleListComponent } from './features/vehicle/components/list/list';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    VehicleFormComponent,
    VehicleListComponent,
    AppRoutingModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App],
})
export class AppModule {}
