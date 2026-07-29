import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../core/services/notificacion.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notificacion-bell',
  imports: [CommonModule],
  templateUrl: './notificacion-bell.html',
  styleUrl: './notificacion-bell.css',
})
export class NotificacionBell implements OnInit, OnDestroy {
  notiService = inject(NotificationService);
  private authService = inject(AuthService);

  abierto = false;

  @ViewChild('bellBtn') bellBtn!: ElementRef<HTMLButtonElement>;
  dropdownStyle: { [k: string]: string } = {};

  ngOnInit() {
    // AJUSTA esta línea al método real de tu AuthService que devuelve
    // el JWT guardado. Si no existe getToken(), usa el que sí tengas
    // (ej. localStorage.getItem('token') directo).
    const token = this.authService.getToken?.() ?? localStorage.getItem('token');
    if (token) {
      this.notiService.iniciar(token);
    } else {
      console.warn('[notificaciones] no hay token disponible, no se inicia el stream');
    }
  }

  ngOnDestroy() {
    this.notiService.desconectar();
  }

  toggle() {
    this.abierto = !this.abierto;
    if (this.abierto) {
      this.calcularPosicion();
    }
  }

  private calcularPosicion() {
    const rect = this.bellBtn.nativeElement.getBoundingClientRect();
    this.dropdownStyle = {
      position: 'fixed',
      left: `${rect.right + 8}px`,
      bottom: `${window.innerHeight - rect.bottom}px`,
    };
  }

  marcarLeida(id: number, event: Event) {
    event.stopPropagation();
    this.notiService.marcarLeida(id);
  }

  marcarTodas() {
    this.notiService.marcarTodasLeidas();
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: Event) {
    if (!(event.target as HTMLElement).closest('.notif-wrapper')) {
      this.abierto = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.abierto) this.calcularPosicion();
  }
}