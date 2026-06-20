export interface CategoriaModel {
  cat_id: number;
  cat_nom: string;
  cat_des: string | null;
  cat_est: string | null;
  cat_products?: number;
}