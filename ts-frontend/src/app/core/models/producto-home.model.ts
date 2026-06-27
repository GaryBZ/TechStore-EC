export interface ProductoHomeModel {
  prd_id: number;
  prd_nom: string;
  prd_des: string | null;
  prd_sku: string;
  pro_img: string | null;
  prd_pre_ven: number;
  cat_id: number;
  mar_id: number;
  tip_id: number;
  inv_stk_act: number;
  total_vendido?: number;
}