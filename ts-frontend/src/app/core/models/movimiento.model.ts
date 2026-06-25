export interface MovimientoModel {
  mov_id: number;
  prd_id: number;
  usu_id: number;
  ped_id: number | null;
  mov_tip: string;
  mov_can: number;
  mov_mot: string | null;
  mov_fec: string | null;
  mov_est: string | null;
}