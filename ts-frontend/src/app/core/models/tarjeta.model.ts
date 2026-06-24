export type MarcaTarjeta = 'visa' | 'mastercard' | 'desconocida';

export interface TarjetaModel {
  tar_id: number;
  mpg_id: number;
  tar_alias: string;
  tar_ult4: string;
  tar_marca: MarcaTarjeta;
  tar_titu: string;
  tar_venc: string; // MM/YY
  tar_est: string;
}