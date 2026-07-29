import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

export interface Notificacion {
  not_id: number;
  usu_id: number | null;
  usu_nom?: string;
  usu_ape?: string;
  not_tab: string;
  not_acc: string;
  not_niv: 'ALTA' | 'CRITICA';
  not_msj: string;
  not_ip: string;
  not_leida: 'S' | 'N';
  not_fec: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private eventSource?: EventSource;

  // Estado reactivo con Signals (Angular 17+). Si usas una versión
  // anterior, cambia signal/computed por BehaviorSubject sin problema.
  private _notificaciones = signal<Notificacion[]>([]);
  notificaciones = this._notificaciones.asReadonly();
  noLeidas = computed(() => this._notificaciones().length);

  constructor(private http: HttpClient) {}

  /** Llamar una sola vez, ej. en el ngOnInit del layout admin (App shell) */
  iniciar(token: string) {
    this.cargarPendientes();
    this.conectarStream(token);
  }

  private cargarPendientes() {
    this.http
      .get<Notificacion[]>(`${environment.apiUrl}/notificaciones/pendientes`)
      .subscribe({
        next: (data) => this._notificaciones.set(data),
        error: (err) => console.error('Error cargando notificaciones pendientes:', err),
      });
  }

  private conectarStream(token: string) {
    // EventSource nativo no manda headers -> token va en query string
    const url = `${environment.apiUrl}/notificaciones/stream?token=${token}`;
    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener('notificacion', (event: MessageEvent) => {
      const noti: Notificacion = JSON.parse(event.data);
      this._notificaciones.update((actual) => [noti, ...actual]);

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('Acción crítica detectada', { body: noti.not_msj });
      }
    });

    this.eventSource.onerror = () => {
      console.warn('SSE desconectado, el navegador reintentará solo.');
    };
  }

  marcarLeida(id: number) {
    this.http
      .patch(`${environment.apiUrl}/notificaciones/${id}/leida`, {})
      .subscribe(() => {
        this._notificaciones.update((actual) => actual.filter((n) => n.not_id !== id));
      });
  }

  marcarTodasLeidas() {
    this.http
      .patch(`${environment.apiUrl}/notificaciones/leer-todas`, {})
      .subscribe(() => this._notificaciones.set([]));
  }

  desconectar() {
    this.eventSource?.close();
  }
}