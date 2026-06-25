export interface InventarioModel {
  inv_id: number;
  prd_id: number;
  inv_stk_act: number;
  inv_fec_act: string | null;
  inv_est: string | null;
}