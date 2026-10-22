import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipesRoutingModule } from './recipes-routing.module';

@NgModule({
  declarations: [RecipeListComponent, RecipeDetailComponent, RecipeFormComponent],
  imports: [SharedModule, RecipesRoutingModule],
})
export class RecipesModule {}
