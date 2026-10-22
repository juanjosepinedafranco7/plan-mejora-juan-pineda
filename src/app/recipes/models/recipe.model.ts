// "type" con barras verticales: el valor SOLO puede ser uno de estos tres textos
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

// Una receta tal como la devuelve DummyJSON
export interface Recipe {
  id: number;
  name: string;
  ingredients: string[]; // "string[]" = lista de textos
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

// Respuesta de GET /recipes: la lista + datos para paginar
export interface RecipesResponse {
  recipes: Recipe[];
  total: number; // total de recetas en el servidor
  skip: number; // cuántas se saltó
  limit: number; // cuántas devolvió
}

// Los campos que maneja el formulario de crear/editar
export interface RecipeFormValue {
  name: string;
  cuisine: string;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
}
