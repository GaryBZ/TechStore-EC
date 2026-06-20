export interface UsuarioModel {
  usu_id: number;
  rol_id: number;
  rol_nom: string;
  usu_nom: string;
  usu_ape: string;
  usu_cor: string;
  usu_tel: string | null;
  usu_ced?: string | null;
  usu_dir?: string | null;
  ciu_id?: number | null;
  usu_est: string | null;
  usu_fec_reg?: string | null;
  token?: string;
}