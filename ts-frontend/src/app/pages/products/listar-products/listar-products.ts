import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoModel } from '../../../core/models/producto.model';
import { CategoriaModel } from '../../../core/models/categoria.model';
import { MarcaModel } from '../../../core/models/marca.model';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { MarcaService } from '../../../core/services/marca.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-listar-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-products.html',
  styleUrl: './listar-products.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListarProducts implements OnInit {
  products: ProductoModel[] = [];
  categorias: CategoriaModel[] = [];
  marcas: MarcaModel[] = [];
  agregandoIds = new Set<number>();

  query = '';
  sortBy = 'recientes';
  loading = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadMarcas();

    this.route.queryParams.subscribe((params) => {
      this.query = (params['q'] ?? '').trim();
      this.buscar();
    });
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

  buscar(): void {
    if (!this.query) {
      this.products = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.productoService.getAll().subscribe({
      next: (data) => {
        const term = this.query.toLowerCase();
        this.products = data.filter(
          (p) => p.prd_est === 'A' && p.prd_nom.toLowerCase().includes(term),
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applySort(): void {
    // se aplica directamente en el getter sortedProducts
  }

  get sortedProducts(): ProductoModel[] {
    let result = [...this.products];
    if (this.sortBy === 'precio-asc') result = result.sort((a, b) => a.prd_pre_ven - b.prd_pre_ven);
    if (this.sortBy === 'precio-desc')
      result = result.sort((a, b) => b.prd_pre_ven - a.prd_pre_ven);
    return result;
  }

  getCategoriaNombre(cat_id: number): string {
    return this.categorias.find((c) => c.cat_id === cat_id)?.cat_nom ?? '';
  }

  getMarcaNombre(mar_id: number): string {
    return this.marcas.find((m) => m.mar_id === mar_id)?.mar_nom ?? '';
  }

  addToCart(prod: ProductoModel): void {
    if (this.agregandoIds.has(prod.prd_id)) return; // ya hay una petición en curso para este producto

    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      return;
    }

    this.agregandoIds.add(prod.prd_id);

    this.carritoService.agregarProducto(usuario.usu_id, prod.prd_id, 1).subscribe({
      next: () => {
        console.log('Producto agregado al carrito');
        this.agregandoIds.delete(prod.prd_id);
      },
      error: (err) => {
        console.error('Error agregando al carrito', err);
        this.agregandoIds.delete(prod.prd_id);
      },
    });
  }
}
