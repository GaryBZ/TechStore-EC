export interface PedidoModel {
  ped_id: number;
  usu_id: number;
  usu_nom?: string;
  usu_ape?: string;
  usu_cor?: string;
  usu_tel?: string;
  epd_id: number;
  epd_nom?: string;
  ciu_id: number | null;
  ped_fec: string;
  ped_sub: number;
  ped_iva: number;
  ped_tot: number;
  ped_dir_env: string;
  ped_obs: string | null;
  ped_est: string | null;
}