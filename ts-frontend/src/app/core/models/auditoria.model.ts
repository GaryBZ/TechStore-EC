export interface AuditoriaModel {
  aud_id: number;
  usu_id: number | null;
  aud_tab: string;
  aud_acc: 'INSERT' | 'UPDATE' | 'DELETE';
  aud_val_ant: string | null;
  aud_val_nue: string | null;
  aud_ip: string | null;
  aud_fec: string;
}