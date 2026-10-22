import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Recipe } from '../models/recipe.model';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-list',
  standalone: false,
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
// OnInit: obliga a tener ngOnInit(), que Angular ejecuta una vez cuando el componente está listo
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  total = 0; // total de recetas que reporta la API
  readonly limit = 10; // tamaño de página
  currentPage = 1;
  loading = false;
  errorMessage = '';

  // FormControl suelto: un solo campo de formulario (el buscador)
  searchControl = new FormControl('', { nonNullable: true });

  // Texto de búsqueda ya aplicado. Se separa del input para que escribir no dispare búsquedas.
  private activeSearch = '';

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  // ---- Cálculos para la paginación (getters: se usan como propiedades en el HTML) ----

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  // "Mostrando 11 – 20 de 50"
  get from(): number {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.limit + 1;
  }

  get to(): number {
    return Math.min(this.currentPage * this.limit, this.total);
  }

  // Ventana de hasta 3 números de página alrededor de la actual
  get visiblePages(): number[] {
    const start = Math.max(1, Math.min(this.currentPage - 1, this.totalPages - 2));
    const end = Math.min(this.totalPages, start + 2);
    const pages: number[] = [];
    for (let page = start; page <= end; page++) {
      pages.push(page);
    }
    return pages;
  }

  // Muestra "..." si hay más páginas después de la ventana
  get showEllipsis(): boolean {
    const pages = this.visiblePages;
    return pages[pages.length - 1] < this.totalPages;
  }

  // ---- Acciones ----

  loadRecipes(): void {
    this.loading = true;
    this.errorMessage = '';
    // skip = cuántas recetas saltar según la página actual
    const skip = (this.currentPage - 1) * this.limit;

    this.recipesService.getRecipes(this.limit, skip, this.activeSearch).subscribe({
      next: (response) => {
        this.recipes = response.recipes;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las recetas.';
        this.loading = false;
      },
    });
  }

  search(): void {
    this.activeSearch = this.searchControl.value.trim();
    this.currentPage = 1; // toda búsqueda nueva empieza en la página 1
    this.loadRecipes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.loadRecipes();
  }

  deleteRecipe(recipe: Recipe): void {
    // confirm() muestra un cuadro Aceptar/Cancelar y devuelve true o false
    const confirmed = window.confirm(`¿Eliminar la receta "${recipe.name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) {
      return;
    }

    this.recipesService.deleteRecipe(recipe.id).subscribe({
      next: () => {
        // DummyJSON simula el borrado, así que actualizamos la lista local nosotros
        this.recipes = this.recipes.filter((item) => item.id !== recipe.id);
        this.total -= 1;

        // Si la página quedó vacía y no es la primera, retrocedemos una
        if (this.recipes.length === 0 && this.currentPage > 1) {
          this.currentPage -= 1;
          this.loadRecipes();
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar la receta.';
      },
    });
  }
}
