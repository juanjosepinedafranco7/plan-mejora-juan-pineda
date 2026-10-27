import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';

// @Injectable le dice a Angular que esta clase es un servicio.
// providedIn: 'root' crea UNA sola instancia (singleton) para toda la app.
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Rutas de la API de autenticación
  private readonly apiUrl = `${API_BASE_URL}/auth`;

  // Claves con las que guardamos datos en localStorage (el navegador los conserva al recargar)
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  // BehaviorSubject: un Observable que guarda el ÚLTIMO valor y se lo da a quien se suscriba.
  // Aquí guarda el usuario actual (o null si no hay sesión).
  private readonly userSubject: BehaviorSubject<AuthUser | null>;

  // Versión de solo lectura que exponemos al resto de la app (nadie fuera puede hacer .next()).
  // Por convención, los Observables terminan en "$".
  readonly currentUser$: Observable<AuthUser | null>;

  // HttpClient se INYECTA: Angular lo crea y nos lo entrega en el constructor.
  constructor(private http: HttpClient) {
    // Al iniciar la app, recuperamos el usuario guardado (si el usuario ya había iniciado sesión)
    this.userSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());
    this.currentUser$ = this.userSubject.asObservable();
  }

  // Inicia sesión. Devuelve un Observable: quien lo llame debe hacer .subscribe()
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      // tap: ejecuta un efecto secundario cuando llega la respuesta, sin modificarla
      tap((response) => {
        // Separamos los tokens del resto de datos del usuario (desestructuración con "rest")
        const { accessToken, refreshToken, ...user } = response;
        localStorage.setItem(this.tokenKey, accessToken);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        // Avisamos a todos los suscriptores (navbar, app) que hay un usuario nuevo
        this.userSubject.next(user);
      })
    );
  }

  // Cierra sesión: borra los datos guardados y avisa que ya no hay usuario
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  // Devuelve el token guardado (o null). Lo usa el interceptor.
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // true si hay token. Lo usan los guards.
  // "!!" convierte cualquier valor a booleano: texto con contenido -> true, null -> false.
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Lee el usuario guardado. JSON.parse puede fallar si el dato está dañado,
  // por eso va dentro de try-catch.
  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
