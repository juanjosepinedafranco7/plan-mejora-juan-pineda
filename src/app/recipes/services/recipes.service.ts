import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';
import { Recipe, RecipeFormValue, RecipesResponse } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private readonly apiUrl = `${API_BASE_URL}/recipes`;

  constructor(private http: HttpClient) {}

  // Lista paginada. limit = cuántas traer, skip = cuántas saltar.
  // Página 1 -> skip 0, página 2 -> skip 10, página 3 -> skip 20...
  // Si hay texto de búsqueda usamos el endpoint /recipes/search?q=...
  getRecipes(limit: number, skip: number, search = ''): Observable<RecipesResponse> {
    // HttpParams construye "?limit=10&skip=0" de forma segura. Es inmutable: set() devuelve uno nuevo.
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    const term = search.trim();

    if (term) {
      params = params.set('q', term);
      return this.http.get<RecipesResponse>(`${this.apiUrl}/search`, { params });
    }
    return this.http.get<RecipesResponse>(this.apiUrl, { params });
  }

  // GET /recipes/5
  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  // POST /recipes/add. DummyJSON SIMULA la creación: responde bien pero no guarda nada.
  createRecipe(data: RecipeFormValue): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/add`, data);
  }

  // PUT /recipes/5. También simulado.
  updateRecipe(id: number, data: RecipeFormValue): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE /recipes/5. También simulado.
  deleteRecipe(id: number): Observable<Recipe> {
    return this.http.delete<Recipe>(`${this.apiUrl}/${id}`);
  }
}
