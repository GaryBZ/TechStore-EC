import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoModel } from '../../../core/models/producto.model';
import { CategoriaModel } from '../../../core/models/categoria.model';
import { MarcaModel } from '../../../core/models/marca.model';
import { TipoModel } from '../../../core/models/tipo.model';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { MarcaService } from '../../../core/services/marca.service';
import { TipoService } from '../../../core/services/tipo.service';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { InventarioService } from '../../../core/services/inventario.service';
interface ProductoConStock extends ProductoModel {
  inv_stk_act: number;
}

@Component({
  selector: 'app-perifericos',
  imports: [FormsModule, CommonModule],
  templateUrl: './perifericos.html',
  styleUrl: './perifericos.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Perifericos implements OnInit {
  products: ProductoConStock[] = [];
  categorias: CategoriaModel[] = [];
  marcas: MarcaModel[] = [];
  agregandoIds = new Set<number>();
  tipoComponentes: TipoModel | null = null;

  selectedMarcas: number[] = [];
  selectedCategorias: number[] = [];
  minPrice = 0;
  maxPrice = 2000;
  globalMin = 0;
  globalMax = 2000;
  sortBy = 'recientes';
  loading = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private tipoService: TipoService,
    private authService: AuthService,
    private carritoService: CarritoService,
    private inventarioService: InventarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadMarcas();
    this.loadTipoYProductos();
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadMarcas(): void {
    this.marcaService.getAll().subscribe({
      next: (data) => {
        this.marcas = data;
        this.cdr.detectChanges();
      },
    });
  }

  loadTipoYProductos(): void {
    this.loading = true;
    this.tipoService.getAll().subscribe({
      next: (tipos) => {
        const componentes = tipos.find((t) => t.tip_nom.toLowerCase() === 'perifericos');
        if (!componentes) {
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.tipoComponentes = componentes;

        this.productoService.getByTipo(componentes.tip_id).subscribe({
          next: (productos) => {
            this.inventarioService.getAll().subscribe({
              next: (inventario) => {
                this.products = productos
                  .filter((p) => p.prd_est === 'A')
                  .map((p) => {
                    const inv = inventario.find((i) => i.prd_id === p.prd_id);
                    return { ...p, inv_stk_act: inv?.inv_stk_act ?? 0 };
                  })
                  .filter((p) => p.inv_stk_act > 0);

                this.setPriceRange();
                this.loading = false;
                this.cdr.detectChanges();
              },
              error: () => {
                this.loading = false;
                this.cdr.detectChanges();
              },
            });
          },
          error: () => {
            this.loading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        console.error('Error cargando tipos', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  setPriceRange(): void {
    if (this.products.length === 0) return;
    const prices = this.products.map((p) => p.prd_pre_ven);
    this.globalMin = Math.floor(Math.min(...prices));
    this.globalMax = Math.ceil(Math.max(...prices));
    this.minPrice = this.globalMin;
    this.maxPrice = this.globalMax;
  }

  toggleMarca(id: number): void {
    this.selectedMarcas = this.selectedMarcas.includes(id)
      ? this.selectedMarcas.filter((m) => m !== id)
      : [...this.selectedMarcas, id];
  }

  toggleCategoria(id: number): void {
    this.selectedCategorias = this.selectedCategorias.includes(id)
      ? this.selectedCategorias.filter((c) => c !== id)
      : [...this.selectedCategorias, id];
  }

  resetFiltros(): void {
    this.selectedMarcas = [];
    this.selectedCategorias = [];
    this.minPrice = this.globalMin;
    this.maxPrice = this.globalMax;
  }

  applySort(): void {}

  get filteredProducts(): ProductoConStock[] {
    let result = this.products.filter((p) => {
      const matchMarca = this.selectedMarcas.length === 0 || this.selectedMarcas.includes(p.mar_id);
      const matchCat =
        this.selectedCategorias.length === 0 || this.selectedCategorias.includes(p.cat_id);
      const matchPrice = p.prd_pre_ven >= this.minPrice && p.prd_pre_ven <= this.maxPrice;
      return matchMarca && matchCat && matchPrice;
    });

    if (this.sortBy === 'precio-asc')
      result = [...result].sort((a, b) => a.prd_pre_ven - b.prd_pre_ven);
    if (this.sortBy === 'precio-desc')
      result = [...result].sort((a, b) => b.prd_pre_ven - a.prd_pre_ven);

    return result;
  }

  getCategoriaNombre(cat_id: number): string {
    return this.categorias.find((c) => c.cat_id === cat_id)?.cat_nom ?? '';
  }

  getMarcaNombre(mar_id: number): string {
    return this.marcas.find((m) => m.mar_id === mar_id)?.mar_nom ?? '';
  }

  get marcasDisponibles(): MarcaModel[] {
    const idsEnUso = new Set(this.products.map((p) => p.mar_id));
    return this.marcas.filter((m) => idsEnUso.has(m.mar_id));
  }

  get categoriasDisponibles(): CategoriaModel[] {
    const idsEnUso = new Set(this.products.map((p) => p.cat_id));
    return this.categorias.filter((c) => idsEnUso.has(c.cat_id));
  }

  esStockBajo(prod: ProductoConStock): boolean {
    const min = prod.prd_stk_min ?? 0;
    return prod.inv_stk_act <= min && prod.inv_stk_act > 0;
  }

  addToCart(prod: ProductoModel): void {
    if (this.agregandoIds.has(prod.prd_id)) return;

    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      return;
    }

    this.agregandoIds.add(prod.prd_id);

    this.carritoService.agregarProducto(usuario.usu_id, prod.prd_id, 1).subscribe({
      next: () => {
        console.log('Producto agregado al carrito');

        this.carritoService.notificarCambioCarrito();

        this.agregandoIds.delete(prod.prd_id);
      },
      error: (err) => {
        console.error('Error agregando al carrito', err);
        this.agregandoIds.delete(prod.prd_id);
      },
    });
  }
}
