import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovimientoModel } from '../../../core/models/movimiento.model';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { ProductoModel } from '../../../core/models/producto.model';
import { ProductoService } from '../../../core/services/producto.service';
import { UsuarioModel } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

interface MovimientoConDetalle extends MovimientoModel {
  prd_nom?: string;
  prd_sku?: string;
  usu_nom?: string;
}
@Component({
  selector: 'app-movimientos-inventario',
  imports: [FormsModule, CommonModule],
  templateUrl: './movimientos-inventario.html',
  styleUrl: './movimientos-inventario.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MovimientosInventario implements OnInit {
  movimientos: MovimientoConDetalle[] = [];
  productos: ProductoModel[] = [];
  usuarios: UsuarioModel[] = [];

  search = '';
  filterTipo = '';
  loading = false;

  constructor(
    private movimientoService: MovimientoService,
    private productoService: ProductoService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDatos();
  }

  loadDatos(): void {
    this.loading = true;

    this.productoService.getAll().subscribe({
      next: (productos) => {
        this.productos = productos;

        this.usuarioService.getAll().subscribe({
          next: (usuarios) => {
            this.usuarios = usuarios;

            this.movimientoService.getAll().subscribe({
              next: (data) => {
                this.movimientos = this.mapConDetalle(data);
                this.loading = false;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error cargando movimientos', err);
                this.loading = false;
                this.cdr.detectChanges();
              },
            });
          },
          error: (err) => {
            console.error('Error cargando usuarios', err);
            this.loading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapConDetalle(data: MovimientoModel[]): MovimientoConDetalle[] {
    return data
      .map((m) => {
        const prod = this.productos.find((p) => p.prd_id === m.prd_id);
        const usu = this.usuarios.find((u) => u.usu_id === m.usu_id);
        return {
          ...m,
          prd_nom: prod?.prd_nom ?? `Producto #${m.prd_id}`,
          prd_sku: prod?.prd_sku ?? '',
          usu_nom: usu ? `${usu.usu_nom} ${usu.usu_ape}` : 'Sistema',
        };
      })
      .sort((a, b) => b.mov_id - a.mov_id);
  }

  get tiposUnicos(): string[] {
    return [...new Set(this.movimientos.map((m) => m.mov_tip))].sort();
  }

  get filteredMovimientos(): MovimientoConDetalle[] {
    const term = this.search.toLowerCase();
    return this.movimientos.filter((m) => {
      const matchSearch =
        !term ||
        m.prd_nom?.toLowerCase().includes(term) ||
        m.usu_nom?.toLowerCase().includes(term) ||
        String(m.ped_id ?? '').includes(term);
      const matchTipo = !this.filterTipo || m.mov_tip === this.filterTipo;
      return matchSearch && matchTipo;
    });
  }

  badgeClass(tipo: string): string {
    const t = tipo.toUpperCase();
    if (t === 'ENTRADA') return 'p-green';
    if (t === 'SALIDA') return 'p-red';
    return 'p-blue'; // AJUSTE
  }

  badgeIcon(tipo: string): string {
    const t = tipo.toUpperCase();
    if (t === 'ENTRADA') return 'fa-arrow-down';
    if (t === 'SALIDA') return 'fa-arrow-up';
    return 'fa-sliders';
  }
}
