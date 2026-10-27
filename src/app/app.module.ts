import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, // se importa SOLO aquí, nunca en otros módulos
    AppRoutingModule,
    CoreModule, // se importa SOLO aquí (una única vez)
    SharedModule, // para usar <app-navbar> y el componente 404
  ],
  providers: [],
  bootstrap: [AppComponent], // componente raíz que arranca la app
})
export class AppModule {}
