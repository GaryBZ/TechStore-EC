export interface AuditoriaModel {
  aud_id: number;
  usu_id: number | null;
  usu_nom?: string | null;
  usu_ape?: string | null;
  aud_tab: string;
  aud_acc: string;
  aud_val_ant: string | null;
  aud_val_nue: string | null;
  aud_ip: string | null;
  aud_fec: string | null;
}