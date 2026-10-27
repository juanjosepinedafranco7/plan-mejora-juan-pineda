import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

// Rutas HIJAS: se suman al prefijo "/auth" definido en app-routing
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' }, // /auth -> /auth/login
  { path: 'login', component: LoginComponent }, // /auth/login
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // forChild en módulos de funcionalidad
  exports: [RouterModule],
})
export class AuthRoutingModule {}
