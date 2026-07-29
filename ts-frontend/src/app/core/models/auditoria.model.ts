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
export function getNivelCriticidad(tabla: string, accion: string): string | null {
  const tab = (tabla || '').toLowerCase();
  const acc = (accion || '').toUpperCase();
 
  if (tab === 'usuarios') {
    if (acc === 'DELETE') return 'CRITICA';
    if (acc === 'UPDATE') return 'MEDIA';
    if (acc === 'INSERT') return 'BAJA';
  }
  if (tab === 'roles') {
    if (acc === 'DELETE') return 'CRITICA';
    if (acc === 'UPDATE') return 'ALTA';
    if (acc === 'INSERT') return 'ALTA';
  }
  if (tab === 'pagos') {
    if (acc === 'UPDATE') return 'CRITICA';
    if (acc === 'DELETE') return 'CRITICA';
  }
  if (tab === 'tarjetas') {
    if (acc === 'UPDATE') return 'ALTA';
    if (acc === 'DELETE') return 'ALTA';
  }
  if (tab === 'productos') {
    if (acc === 'DELETE') return 'ALTA';
  }
  if (tab === 'pedidos') {
    if (acc === 'DELETE') return 'ALTA';
    if (acc === 'UPDATE') return 'MEDIA';
  }
  if (tab === 'inventario') {
    if (acc === 'UPDATE') return 'MEDIA';
    if (acc === 'DELETE') return 'ALTA';
  }
 
  return null;
}
 
export function claseNivel(nivel: string | null): string {
  if (nivel === 'CRITICA') return 'p-red';
  if (nivel === 'ALTA') return 'p-yellow';
  if (nivel === 'MEDIA') return 'p-blue';
  return 'p-gray';
}