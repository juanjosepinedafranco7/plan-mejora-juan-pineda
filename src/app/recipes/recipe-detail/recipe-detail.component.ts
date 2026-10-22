import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null; // null hasta que llegue la respuesta
  loading = true;
  errorMessage = '';

  // ActivatedRoute da acceso a los datos de la ruta actual (por ejemplo, el :id)
  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    // En la URL /recipes/5, el parámetro "id" vale "5" (siempre llega como texto)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Identificador de receta no válido.';
      this.loading = false;
      return;
    }

    this.recipesService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se encontró la receta solicitada.';
        this.loading = false;
      },
    });
  }
}
