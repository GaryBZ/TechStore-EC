import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductoHomeModel } from '../../core/models/producto-home.model';
import { ProductoHomeService } from '../../core/services/producto-home.service';
import { CategoriaModel } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { MarcaModel } from '../../core/models/marca.model';
import { MarcaService } from '../../core/services/marca.service';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';

interface CategoriaChip {
  nombre: string;
  icono: string;
  ruta: string;
}


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Home implements OnInit {
  masVendidos: ProductoHomeModel[] = [];
  recientes: ProductoHomeModel[] = [];
  categorias: CategoriaModel[] = [];
  marcas: MarcaModel[] = [];

  loadingMasVendidos = false;
  loadingRecientes = false;

  // Chips de categorías de alto nivel (basadas en tus rutas reales)
  categoriasChips: CategoriaChip[] = [
    { nombre: 'Componentes', icono: 'fa-microchip', ruta: '/categoria/componentes' },
    { nombre: 'Periféricos', icono: 'fa-keyboard', ruta: '/categoria/perifericos' },
    { nombre: 'Monitores', icono: 'fa-desktop', ruta: '/categoria/monitores' },
    { nombre: 'Laptops', icono: 'fa-laptop', ruta: '/categoria/laptops' },
  ];

  constructor(
    private productoHomeService: ProductoHomeService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarMarcas();
    this.cargarMasVendidos();
    this.cargarRecientes();
  }

  cargarCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
    });
  }

  cargarMarcas(): void {
    this.marcaService.getAll().subscribe({
      next: (data) => {
        this.marcas = data;
        this.cdr.detectChanges();
      },
    });
  }

  cargarMasVendidos(): void {
    this.loadingMasVendidos = true;
    this.productoHomeService.getMasVendidos(4).subscribe({
      next: (data) => {
        this.masVendidos = data;
        this.loadingMasVendidos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando más vendidos', err);
        this.loadingMasVendidos = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarRecientes(): void {
    this.loadingRecientes = true;
    this.productoHomeService.getRecientes(4).subscribe({
      next: (data) => {
        this.recientes = data;
        this.loadingRecientes = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando recientes', err);
        this.loadingRecientes = false;
        this.cdr.detectChanges();
      },
    });
  }

  getCategoriaNombre(cat_id: number): string {
    return this.categorias.find((c) => c.cat_id === cat_id)?.cat_nom ?? '';
  }

  getMarcaNombre(mar_id: number): string {
    return this.marcas.find((m) => m.mar_id === mar_id)?.mar_nom ?? '';
  }

  addToCart(prod: ProductoHomeModel): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/authentication']);
      return;
    }

    this.carritoService.agregarProducto(usuario.usu_id, prod.prd_id, 1).subscribe({
      next: () => console.log('Producto agregado al carrito'),
      error: (err) => console.error('Error agregando al carrito', err),
    });
  }

  verCategoria(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
