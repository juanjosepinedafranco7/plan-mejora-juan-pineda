import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // FormGroup: agrupa los campos del formulario
  form: FormGroup;
  loading = false; // true mientras esperamos la respuesta del servidor
  errorMessage = '';

  constructor(
    private fb: FormBuilder, // FormBuilder: ayudante para crear formularios con menos código
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // Cada campo: [valorInicial, [validadores]]
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ¿El campo tiene este error específico y el usuario ya lo tocó?
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }

  // ¿El campo es inválido y fue tocado o modificado? Sirve para pintar el borde rojo.
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    // Si el formulario es inválido, marcamos todos los campos como "tocados"
    // para que aparezcan los mensajes de error, y no enviamos nada.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // form.value tiene { username, password }
    const credentials = this.form.value as LoginRequest;

    // El Observable no hace nada hasta el subscribe.
    // next: llegó la respuesta. error: falló la petición.
    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/recipes']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        // DummyJSON responde 400 cuando las credenciales son incorrectas
        this.errorMessage =
          err.status === 400
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor. Intenta de nuevo.';
      },
    });
  }
}
