// Una interface describe la FORMA de un objeto. No existe en tiempo de ejecución,
// solo ayuda a TypeScript a avisarte de errores mientras escribes.

// Lo que enviamos a POST /auth/login
export interface LoginRequest {
  username: string;
  password: string;
}

// Datos básicos del usuario que guardamos en la sesión
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

// Lo que responde POST /auth/login: los datos del usuario + los tokens
// "extends" significa: todo lo de AuthUser y además estos campos.
export interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}
