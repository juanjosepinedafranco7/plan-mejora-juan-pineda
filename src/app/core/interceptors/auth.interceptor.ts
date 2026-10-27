import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { AuthService } from '../services/auth.service';

// Un interceptor es una clase que implementa HttpInterceptor.
// TODAS las peticiones HTTP de la app pasan por intercept() antes de salir.
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // Si no hay token, o la petición no va a nuestra API, la dejamos pasar sin tocarla.
    if (!token || !request.url.startsWith(API_BASE_URL)) {
      return next.handle(request);
    }

    // Las peticiones son INMUTABLES: no se pueden modificar, se clonan con los cambios.
    const authRequest = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    // next.handle envía la petición al siguiente paso (otro interceptor o el servidor)
    return next.handle(authRequest);
  }
}
