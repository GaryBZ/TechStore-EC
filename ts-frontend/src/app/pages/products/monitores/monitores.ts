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

@Component({
  selector: 'app-monitores',
  imports: [FormsModule, CommonModule],
  templateUrl: './monitores.html',
  styleUrl: './monitores.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Monitores implements OnInit {
  products: ProductoModel[] = [];
  categorias: CategoriaModel[] = [];
  marcas: MarcaModel[] = [];
  tipomonitores: TipoModel | null = null;

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
        const monitores = tipos.find((t) => t.tip_nom.toLowerCase() === 'monitores');
        if (monitores) {
          this.tipomonitores = monitores;
          this.productoService.getByTipo(monitores.tip_id).subscribe({
            next: (data) => {
              this.products = data;
              this.setPriceRange();
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando tipos', err);
        this.loading = false;
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

  applySort(): void {
    // se aplica directamente en el getter filteredProducts
  }

  get filteredProducts(): ProductoModel[] {
    let result = this.products.filter((p) => {
      const matchMarca = this.selectedMarcas.length === 0 || this.selectedMarcas.includes(p.mar_id);
      const matchCat =
        this.selectedCategorias.length === 0 || this.selectedCategorias.includes(p.cat_id);
      const matchPrice = p.prd_pre_ven >= this.minPrice && p.prd_pre_ven <= this.maxPrice;
      const matchEstado = p.prd_est === 'A';
      return matchMarca && matchCat && matchPrice && matchEstado;
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

  addToCart(prod: ProductoModel): void {
    console.log('Agregar al carrito:', prod);
    // aquí luego conectamos con CarritoService
  }
}
