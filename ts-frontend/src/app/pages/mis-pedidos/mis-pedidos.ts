import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PedidoModel } from '../../core/models/pedido.model';
import { DetallePedidoModel } from '../../core/models/detalle-pedido.model';
import { PedidoService } from '../../core/services/pedido.service';
import { DetallePedidoService } from '../../core/services/detalle-pedido.service';
import { AuthService } from '../../core/services/auth.service';

interface PasoTimeline {
  epd_id: number;
  nombre: string;
  icono: string;
  completado: boolean;
  activo: boolean;
}

@Component({
  selector: 'app-mis-pedidos',
  imports: [CommonModule],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MisPedidos implements OnInit {
  pedidos: PedidoModel[] = [];
  loading = false;

  expandidoId: number | null = null;
  detalleItems: Record<number, DetallePedidoModel[]> = {};
  cargandoDetalle: Record<number, boolean> = {};

  private secuenciaEstados = [
    { epd_id: 1, nombre: 'Pendiente', icono: 'fa-clock' },
    { epd_id: 2, nombre: 'Pagado', icono: 'fa-credit-card' },
    { epd_id: 3, nombre: 'Enviado', icono: 'fa-truck' },
    { epd_id: 4, nombre: 'Entregado', icono: 'fa-circle-check' },
  ];

  private epdCancelado = 21;

  constructor(
    private pedidoService: PedidoService,
    private detallePedidoService: DetallePedidoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.loading = true;
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        // Si tienes getByUsuario expuesto en el service, usa eso en vez de filtrar aquí
        this.pedidos = data.filter((p) => p.usu_id === usuario.usu_id);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando pedidos', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  estaCancelado(pedido: PedidoModel): boolean {
    return pedido.epd_id === this.epdCancelado;
  }

  timelineDePedido(pedido: PedidoModel): PasoTimeline[] {
    const idxActual = this.secuenciaEstados.findIndex((s) => s.epd_id === pedido.epd_id);

    return this.secuenciaEstados.map((paso, i) => ({
      ...paso,
      completado: i < idxActual || (i === idxActual && !this.estaCancelado(pedido)),
      activo: i === idxActual,
    }));
  }

  toggleExpandir(pedido: PedidoModel): void {
    if (this.expandidoId === pedido.ped_id) {
      this.expandidoId = null;
      return;
    }

    this.expandidoId = pedido.ped_id;

    if (!this.detalleItems[pedido.ped_id]) {
      this.cargandoDetalle[pedido.ped_id] = true;
      this.detallePedidoService.getByPedido(pedido.ped_id).subscribe({
        next: (items) => {
          this.detalleItems[pedido.ped_id] = items;
          this.cargandoDetalle[pedido.ped_id] = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando detalle', err);
          this.cargandoDetalle[pedido.ped_id] = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
