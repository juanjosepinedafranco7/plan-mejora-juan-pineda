import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';

// Prefijo "/recipes" viene de app-routing.
// ORDEN IMPORTANTE: 'new' va ANTES de ':id'. Si no, Angular tomaría "new" como si fuera un id.
const routes: Routes = [
  { path: '', component: RecipeListComponent }, // /recipes
  { path: 'new', component: RecipeFormComponent }, // /recipes/new
  { path: ':id', component: RecipeDetailComponent }, // /recipes/5
  { path: ':id/edit', component: RecipeFormComponent }, // /recipes/5/edit
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
