# Plan de mejora Angular: módulo de recetas

Aplicación Angular con arquitectura modular (NgModules, sin componentes standalone) que consume la API pública [DummyJSON](https://dummyjson.com) e implementa autenticación con token JWT.

## Requisitos

- Node.js 18.19+, 20.11+ o 22
- npm

## Instrucciones de ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/juanjosepinedafranco7/plan-mejora-angular-juan-pineda.git
   cd plan-mejora-angular-juan-pineda
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npx ng serve
   ```
4. Abrir `http://localhost:4200` en el navegador.

## Credenciales de prueba

- Usuario: `emilys`
- Contraseña: `emilyspass`

## Funcionalidades

- Inicio y cierre de sesión con JWT (`POST /auth/login`).
- Listado de recetas paginado de 10 en 10 (`limit` y `skip`) con búsqueda por nombre.
- Detalle de receta por `id`.
- Formulario reactivo de creación y edición en un mismo componente, con validaciones y precarga de datos.
- Eliminación de recetas con confirmación previa.
- Perfil del usuario autenticado (`GET /auth/me`).

> DummyJSON simula las operaciones de crear, editar y eliminar: responde correctamente, pero no guarda los cambios en el servidor.

## Arquitectura

| Módulo | Contenido |
|---|---|
| `CoreModule` | `AuthService`, `AuthInterceptor`, `authGuard` y `guestGuard`. Se importa una sola vez en `AppModule`. |
| `SharedModule` | Barra de navegación, página 404 y reexportación de `CommonModule`, `ReactiveFormsModule` y `RouterModule`. |
| `AuthModule` | Login con formulario reactivo. Carga perezosa en `/auth`. |
| `RecipesModule` | Listado, detalle y formulario. Carga perezosa en `/recipes`, protegido con `authGuard`. |
| `ProfileModule` | Información del usuario. Carga perezosa en `/profile`, protegido con `authGuard`. |

## Estructura del proyecto

```
src/app/
├─ core/       servicios, interceptor, guards y modelos
├─ shared/     navbar y página 404
├─ auth/       login
├─ recipes/    listado, detalle, formulario, servicio y modelos
└─ profile/    perfil del usuario
```

## Flujo de autenticación

1. Sin sesión, `authGuard` redirige a `/auth/login`.
2. `AuthService` envía las credenciales a `POST /auth/login` y guarda el token en `localStorage`.
3. `AuthInterceptor` agrega `Authorization: Bearer <token>` a cada petición hacia la API.
4. Con sesión activa, `guestGuard` impide volver al login.
5. Al cerrar sesión se elimina el token y se redirige al login.

## Autor

Juan José Pineda Franco, Ficha 3231651, Análisis y Desarrollo de Software (SENA).