export type MarcaTarjeta = 'visa' | 'mastercard' | 'desconocida';

export interface TarjetaModel {
  tar_id: number;
  usu_id: number;
  mpg_id: number;
  tar_alias: string | null;
  tar_ult4: string;
  tar_marca: MarcaTarjeta;
  tar_titu: string;
  tar_venc: string;
  tar_est: string;
  tar_fec_reg?: string;
}