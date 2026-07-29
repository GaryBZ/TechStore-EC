import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoModel } from '../../../../core/models/producto.model';
import { ProductoService } from '../../../../core/services/producto.service';
import { CategoriaModel } from '../../../../core/models/categoria.model';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { MarcaModel } from '../../../../core/models/marca.model';
import { MarcaService } from '../../../../core/services/marca.service';
import { TipoService } from '../../../../core/services/tipo.service';
import { TipoModel } from '../../../../core/models/tipo.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-listar-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-producto.html',
  styleUrl: './listar-producto.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListarProducto implements OnInit {
  products: ProductoModel[] = [];
  categorias: CategoriaModel[] = [];
  marcas: MarcaModel[] = [];
  tipos: TipoModel[] = [];

  search = '';
  filterCat = '';
  filterMar = '';
  filterTipo = '';
  loading = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private authService: AuthService,
    private tipoService: TipoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
    this.loadMarcas();
    this.loadTipos();
  }

  get esAdministrador(): boolean {
    const rol = this.authService.getCurrentUser()?.rol_nom;
    return rol === 'administrador' || rol === 'admin';
  }

  loadProductos(): void {
    this.loading = true;
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.loading = false;
      },
    });
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  loadMarcas(): void {
    this.marcaService.getAll().subscribe({
      next: (data) => {
        this.marcas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando marcas', err),
    });
  }

  loadTipos(): void {
    this.tipoService.getAll().subscribe({
      next: (data) => {
        this.tipos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando tipos', err),
    });
  }

  get filteredProducts(): ProductoModel[] {
    return this.products.filter((p) => {
      const matchSearch = p?.prd_nom && p.prd_nom.toLowerCase().includes(this.search.toLowerCase());
      const matchCat = !this.filterCat || p.cat_id === Number(this.filterCat);
      const matchMar = !this.filterMar || p.mar_id === Number(this.filterMar);
      const matchTipo = !this.filterTipo || p.tip_id === Number(this.filterTipo);
      return matchSearch && matchCat && matchMar && matchTipo;
    });
  }

  getCategoriaNombre(cat_id: number): string {
    return this.categorias.find((c) => c.cat_id === cat_id)?.cat_nom ?? '—';
  }

  getMarcaNombre(mar_id: number): string {
    return this.marcas.find((m) => m.mar_id === mar_id)?.mar_nom ?? '—';
  }

  getTipoNombre(tip_id: number): string {
    return this.tipos.find((t) => t.tip_id === tip_id)?.tip_nom ?? '—';
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;

    this.productoService.remove(id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.prd_id !== id);
        this.showToast('Producto eliminado');
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

  gestionar(id: number): void {
    this.router.navigate(['/admin/productos', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/admin/productos/crear']);
  }
}
