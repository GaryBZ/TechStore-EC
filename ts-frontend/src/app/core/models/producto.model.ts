export interface ProductoModel {
  prd_id: number;
  cat_id: number;
  pro_id: number;
  mar_id: number;
  prd_nom: string;
  prd_des: string | null;
  prd_sku: string;
  pro_img: string | null;
  prd_pre_com: number;
  prd_pre_ven: number;
  prd_stk_min: number | null;
  prd_est: string | null;
  prd_fec_cre: string | null;
}