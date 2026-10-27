import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // true cuando hay usuario en sesión; controla si se muestra la barra de navegación
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    // map transforma cada valor del Observable: usuario -> true, null -> false
    this.isLoggedIn$ = this.authService.currentUser$.pipe(map((user) => user !== null));
  }
}
