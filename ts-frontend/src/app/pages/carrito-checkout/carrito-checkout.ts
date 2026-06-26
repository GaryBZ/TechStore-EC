import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoItemModel } from '../../core/models/carrito-item.model';
import { TarjetaModel } from '../../core/models/tarjeta.model';
import { CarritoService } from '../../core/services/carrito.service';
import { TarjetaService } from '../../core/services/tarjeta.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-carrito-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito-checkout.html',
  styleUrl: './carrito-checkout.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CarritoCheckout implements OnInit {
  items: CarritoItemModel[] = [];
  tarjetas: TarjetaModel[] = [];
  carId: number | null = null;

  loading = false;
  confirmando = false;

  tarjetaSeleccionada: number | null = null;
  direccionEnvio = '';
  observaciones = '';

  constructor(
    private carritoService: CarritoService,
    private tarjetaService: TarjetaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarTarjetas();

    const usuario = this.authService.getCurrentUser();
    this.direccionEnvio = usuario?.usu_dir ?? '';
  }

  cargarCarrito(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.loading = true;
    this.carritoService.getCarrito(usuario.usu_id).subscribe({
      next: (data) => {
        this.items = data?.items ?? [];
        this.carId = data?.carrito?.car_id ?? null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando carrito', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarTarjetas(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.tarjetaService.getByUsuario(usuario.usu_id).subscribe({
      next: (data) => {
        this.tarjetas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando tarjetas', err),
    });
  }

  get subtotal(): number {
    return this.items.reduce((acc, i) => acc + i.dca_sub, 0);
  }

  get iva(): number {
    return Math.round(this.subtotal * 0.15 * 100) / 100;
  }

  get total(): number {
    return this.subtotal + this.iva;
  }

  cambiarCantidad(item: CarritoItemModel, nuevaCantidad: number): void {
    if (nuevaCantidad < 1) return;

    this.carritoService.actualizarCantidad(item.dca_id, nuevaCantidad).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => alert(err.error?.message || 'Error al actualizar cantidad'),
    });
  }

  eliminarItem(item: CarritoItemModel): void {
    if (!confirm('¿Quitar este producto del carrito?')) return;

    this.carritoService.eliminarItem(item.dca_id).subscribe({
      next: () => this.cargarCarrito(),
      error: (err) => alert(err.error?.message || 'Error al eliminar'),
    });
  }

  confirmarPedido(): void {
    if (this.confirmando) return;

    const usuario = this.authService.getCurrentUser();
    if (!usuario || !this.carId) return;

    if (!this.tarjetaSeleccionada) {
      alert('Selecciona un método de pago');
      return;
    }
    if (!this.direccionEnvio.trim()) {
      alert('Ingresa una dirección de envío');
      return;
    }

    const tarjeta = this.tarjetas.find((t) => t.tar_id === this.tarjetaSeleccionada);
    if (!tarjeta) return;

    this.confirmando = true;

    this.carritoService
      .confirmarPedido(
        usuario.usu_id,
        this.carId,
        tarjeta.mpg_id,
        this.direccionEnvio.trim(),
        this.observaciones.trim(),
      )
      .subscribe({
        next: (pedido) => {
          this.confirmando = false;
          alert(`¡Pedido #${pedido.ped_id} confirmado! Total: $${pedido.ped_tot}`);
          this.router.navigate(['/inicio']);
        },
        error: (err) => {
          this.confirmando = false;
          alert(err.error?.message || 'Error al confirmar el pedido');
        },
      });
  }
}
