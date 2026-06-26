export interface DetallePedidoModel {
  dpe_id: number;
  ped_id: number;
  prd_id: number;
  dpe_can: number;
  dpe_pre_uni: number;
  dpe_sub: number;
  dpe_est: string | null;
  prd_nom?: string;
}