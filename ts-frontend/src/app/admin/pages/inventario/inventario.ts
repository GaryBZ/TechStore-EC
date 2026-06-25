import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventarioModel } from '../../../core/models/inventario.model';
import { ProductoModel } from '../../../core/models/producto.model';
import { InventarioService } from '../../../core/services/inventario.service';
import { ProductoService } from '../../../core/services/producto.service';
import { AuthService } from '../../../core/services/auth.service';
interface InventarioConProducto extends InventarioModel {
  prd_nom?: string;
  prd_sku?: string;
}
@Component({
  selector: 'app-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Inventario implements OnInit {
  inventario: InventarioConProducto[] = [];
  productos: ProductoModel[] = [];

  editingId: number | null = null;
  search = '';
  loading = false;

  addOpen = false;
  newProductoId: number | null = null;
  newStock: number | null = null;

  editStock: number | null = null;

  constructor(
    private inventarioService: InventarioService,
    private productoService: ProductoService,
    private authService: AuthService,
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
        this.inventarioService.getAll().subscribe({
          next: (data) => {
            this.inventario = this.mapConProducto(data);
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error cargando inventario', err);
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

  private mapConProducto(data: InventarioModel[]): InventarioConProducto[] {
    return data.map((inv) => {
      const prod = this.productos.find((p) => p.prd_id === inv.prd_id);
      return {
        ...inv,
        prd_nom: prod?.prd_nom ?? `Producto #${inv.prd_id}`,
        prd_sku: prod?.prd_sku ?? '',
      };
    });
  }

  get productoSeleccionadoNuevo(): ProductoModel | undefined {
    return this.productos.find((p) => p.prd_id === this.newProductoId);
  }

  get filteredInventario(): InventarioConProducto[] {
    const term = this.search.toLowerCase();
    return this.inventario.filter(
      (i) => i.prd_nom?.toLowerCase().includes(term) || i.prd_sku?.toLowerCase().includes(term),
    );
  }

  /** Productos que aún no tienen inventario, para no duplicar registros */
  get productosDisponibles(): ProductoModel[] {
    const idsConInventario = new Set(this.inventario.map((i) => i.prd_id));
    return this.productos.filter((p) => !idsConInventario.has(p.prd_id));
  }

  // ---------- Agregar ----------

  openAdd(): void {
    this.cancelEdit();
    this.newProductoId = null;
    this.newStock = null;
    this.addOpen = true;
  }

  cancelAdd(): void {
    this.addOpen = false;
    this.newProductoId = null;
    this.newStock = null;
  }

  saveInventario(): void {
    if (!this.newProductoId) {
      alert('Selecciona un producto');
      return;
    }
    if (this.newStock == null || this.newStock < 0) {
      alert('Ingresa un stock válido');
      return;
    }

    const producto = this.productoSeleccionadoNuevo;
    const stockMin = producto?.prd_stk_min ?? 0;
    if (this.newStock < stockMin) {
      alert(`El stock no puede ser menor al mínimo requerido (${stockMin}) para este producto`);
      return;
    }

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.inventarioService
      .create({
        prd_id: this.newProductoId,
        inv_stk_act: this.newStock,
        inv_est: 'A',
        usu_id_actor: usuario.usu_id,
      } as any)
      .subscribe({
        next: (data) => {
          if (data) {
            const conProducto = this.mapConProducto([data])[0];
            this.inventario.unshift(conProducto);
          }
          this.cancelAdd();
          this.showToast('Inventario creado');
          this.cdr.detectChanges();
        },
        error: (err) => alert(err.error?.message || 'Error al crear'),
      });
  }

  // ---------- Editar ----------

  startEdit(item: InventarioConProducto): void {
    this.addOpen = false;
    this.editingId = item.inv_id;
    this.editStock = item.inv_stk_act;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editStock = null;
  }

  saveEdit(item: InventarioConProducto): void {
    if (this.editStock == null || this.editStock < 0) {
      alert('Ingresa un stock válido');
      return;
    }

    const producto = this.productos.find((p) => p.prd_id === item.prd_id);
    const stockMin = producto?.prd_stk_min ?? 0;
    if (this.editStock < stockMin) {
      alert(`El stock no puede ser menor al mínimo requerido (${stockMin}) para este producto`);
      return;
    }

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.inventarioService
      .update(item.inv_id, {
        prd_id: item.prd_id,
        inv_stk_act: this.editStock,
        inv_est: item.inv_est,
        usu_id_actor: usuario.usu_id,
      } as any)
      .subscribe({
        next: (data) => {
          if (data) {
            const i = this.inventario.findIndex((x) => x.inv_id === item.inv_id);
            if (i !== -1) this.inventario[i] = this.mapConProducto([data])[0];
          }
          this.cancelEdit();
          this.showToast('Stock actualizado');
          this.cdr.detectChanges();
        },
        error: (err) => alert(err.error?.message || 'Error al actualizar'),
      });
  }

  // ---------- Eliminar ----------

  deleteRegistro(id: number): void {
    if (!confirm('¿Eliminar este registro de inventario?')) return;

    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.inventarioService.delete(id, usuario.usu_id).subscribe({
      next: () => {
        this.inventario = this.inventario.filter((i) => i.inv_id !== id);
        this.showToast('Registro eliminado');
        this.cdr.detectChanges();
      },
      error: (err) => alert(err.error?.message || 'Error al eliminar'),
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
