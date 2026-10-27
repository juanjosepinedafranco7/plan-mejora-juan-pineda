import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUser } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar', // etiqueta HTML: <app-navbar></app-navbar>
  standalone: false, // pertenece a un NgModule, NO es standalone
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // Observable con el usuario actual. En el HTML se lee con el pipe "async".
  user$: Observable<AuthUser | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.currentUser$;
  }

  // Iniciales para el círculo del avatar: "Emily Johnson" -> "EJ"
  getInitials(user: AuthUser): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
