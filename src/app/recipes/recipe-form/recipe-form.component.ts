import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Difficulty, RecipeFormValue } from '../models/recipe.model';
import { RecipesService } from '../services/recipes.service';

// Validador PERSONALIZADO: una función que recibe el campo y devuelve
// null si es válido, o un objeto con el error si no lo es.
// Valida "mayor a 0" (Validators.min(1) también rechazaría decimales como 0.5).
function greaterThanZero(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '') {
    return null; // campo vacío: de eso se encarga Validators.required
  }
  return Number(value) > 0 ? null : { greaterThanZero: true };
}

@Component({
  selector: 'app-recipe-form',
  standalone: false,
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css',
})
export class RecipeFormComponent implements OnInit {
  form: FormGroup;
  difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard']; // opciones del select
  isEditMode = false; // true en /recipes/:id/edit, false en /recipes/new
  recipeId: number | null = null;
  loading = false; // cargando datos para editar
  saving = false; // guardando cambios
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cuisine: ['', [Validators.required]],
      difficulty: ['Easy', [Validators.required]],
      prepTimeMinutes: [null, [Validators.required, greaterThanZero]],
      cookTimeMinutes: [null, [Validators.required, greaterThanZero]],
      servings: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Un mismo componente sirve para crear y editar: si la URL trae :id, es edición
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.recipeId = Number(idParam);
      this.loadRecipe(this.recipeId);
    }
  }

  // Trae la receta y PRECARGA el formulario con sus datos
  private loadRecipe(id: number): void {
    this.loading = true;

    this.recipesService.getRecipe(id).subscribe({
      next: (recipe) => {
        // patchValue llena los campos indicados con los valores recibidos
        this.form.patchValue({
          name: recipe.name,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la receta a editar.';
        this.loading = false;
      },
    });
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    const data = this.form.value as RecipeFormValue;

    // Según el modo, elegimos qué petición hacer (ambas devuelven Observable)
    const request$ =
      this.isEditMode && this.recipeId !== null
        ? this.recipesService.updateRecipe(this.recipeId, data)
        : this.recipesService.createRecipe(data);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/recipes']);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'No se pudo guardar la receta. Intenta de nuevo.';
      },
    });
  }
}
