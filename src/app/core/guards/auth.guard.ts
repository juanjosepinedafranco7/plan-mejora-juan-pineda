import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard funcional: una función que el router ejecuta antes de entrar a la ruta.
// Debe devolver true (dejar pasar) o un UrlTree (redirigir a otra ruta).
export const authGuard: CanActivateFn = () => {
  // En una función no hay constructor, así que se usa inject() para pedir dependencias
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Sin sesión: redirige al login
  return router.createUrlTree(['/auth/login']);
};
