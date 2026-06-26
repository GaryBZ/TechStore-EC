import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidoModel } from '../../../core/models/pedido.model';
import { PedidoService } from '../../../core/services/pedido.service';
import { DetallePedidoModel } from '../../../core/models/detalle-pedido.model';
import { DetallePedidoService } from '../../../core/services/detalle-pedido.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pedidos',
  imports: [FormsModule, CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Pedidos implements OnInit {
  pedidos: PedidoModel[] = [];
  search = '';
  filterEstado = '';
  loading = false;

  modalAbierto = false;
  pedidoSeleccionado: PedidoModel | null = null;
  detalleItems: DetallePedidoModel[] = [];
  cargandoDetalle = false;

  // Estos IDs dependen de tu tabla estados_pedido — ajústalos a los reales
  estadosDisponibles = [
    { epd_id: 1, epd_nom: 'Pendiente' },
    { epd_id: 2, epd_nom: 'Procesando' },
    { epd_id: 3, epd_nom: 'Enviado' },
    { epd_id: 4, epd_nom: 'Entregado' },
    { epd_id: 21, epd_nom: 'Cancelado' },
  ];

  constructor(
    private pedidoService: PedidoService,
    private detallePedidoService: DetallePedidoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.loading = true;
    this.pedidoService.getAll().subscribe({
      next: (data) => {
        this.pedidos = data;
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

  get estadosUnicos(): string[] {
    return [...new Set(this.pedidos.map((p) => p.epd_nom).filter(Boolean))] as string[];
  }

  get filteredPedidos(): PedidoModel[] {
    const term = this.search.toLowerCase();
    return this.pedidos.filter((p) => {
      const matchSearch =
        !term ||
        String(p.ped_id).includes(term) ||
        `${p.usu_nom ?? ''} ${p.usu_ape ?? ''}`.toLowerCase().includes(term);
      const matchEstado = !this.filterEstado || p.epd_nom === this.filterEstado;
      return matchSearch && matchEstado;
    });
  }

  badgeClass(epd_nom?: string): string {
    const nom = (epd_nom ?? '').toLowerCase();
    if (nom.includes('entregado')) return 'p-green';
    if (nom.includes('cancelado')) return 'p-red';
    if (nom.includes('enviado') || nom.includes('procesando')) return 'p-blue';
    return 'p-yellow';
  }

  // ---------- Modal detalle ----------

  verDetalle(pedido: PedidoModel): void {
    this.pedidoSeleccionado = pedido;
    this.modalAbierto = true;
    this.cargandoDetalle = true;
    this.detalleItems = [];

    this.detallePedidoService.getByPedido(pedido.ped_id).subscribe({
      next: (items) => {
        this.detalleItems = items;
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando detalle', err);
        this.cargandoDetalle = false;
        this.cdr.detectChanges();
      },
    });
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.pedidoSeleccionado = null;
    this.detalleItems = [];
  }

  // ---------- Cambiar estado ----------

  cambiarEstado(pedido: PedidoModel, nuevoEpdId: number): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.pedidoService.updateEstado(pedido.ped_id, nuevoEpdId, usuario.usu_id).subscribe({
      next: (data) => {
        if (data) {
          const i = this.pedidos.findIndex((p) => p.ped_id === pedido.ped_id);
          if (i !== -1) this.pedidos[i] = { ...this.pedidos[i], ...data };
        }
        this.showToast('Estado actualizado');
        this.cdr.detectChanges();
      },
      error: (err) => alert(err.error?.message || 'Error al actualizar estado'),
    });
  }

  cancelarPedido(pedido: PedidoModel): void {
    if (!confirm(`¿Cancelar el pedido #${pedido.ped_id}?`)) return;

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.pedidoService.cancelar(pedido.ped_id, usuario.usu_id).subscribe({
      next: () => {
        this.pedidos = this.pedidos.filter((p) => p.ped_id !== pedido.ped_id);
        this.showToast('Pedido cancelado');
        this.cdr.detectChanges();
      },
      error: (err) => alert(err.error?.message || 'Error al cancelar'),
    });
  }

  showToast(msg: string): void {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }
}