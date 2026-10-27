import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [
    // Registra HttpClient en toda la app. withInterceptorsFromDi() permite usar
    // interceptores de clase (los que se registran con HTTP_INTERCEPTORS).
    provideHttpClient(withInterceptorsFromDi()),

    // Registra nuestro interceptor. multi: true permite tener varios interceptores a la vez.
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {
  // Seguro para que CoreModule se importe UNA sola vez (solo en AppModule).
  // @SkipSelf busca CoreModule en el inyector padre; si existe, ya fue importado antes.
  constructor(@Optional() @SkipSelf() parentModule: CoreModule | null) {
    if (parentModule) {
      throw new Error('CoreModule ya fue cargado. Impórtalo únicamente en AppModule.');
    }
  }
}
