import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  // Raíz: redirige a recetas. pathMatch 'full' = solo cuando la URL es exactamente vacía.
  { path: '', pathMatch: 'full', redirectTo: 'recipes' },

  // Lazy loading: el módulo se descarga solo al visitar la ruta.
  // canActivate ejecuta el guard antes de entrar.
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'recipes',
    canActivate: [authGuard],
    loadChildren: () => import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
  },

  // Comodín: cualquier ruta que no coincida llega aquí. SIEMPRE va al final.
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  // forRoot se usa UNA vez, en el módulo raíz. Los demás usan forChild.
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
