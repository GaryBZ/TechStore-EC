import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioModel } from '../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Navbar {
  user = signal<UsuarioModel | null>(null);
  dropdownOpen = signal(false);
  searchTerm = signal('');
  cartCount = signal(0);

  constructor(
    private router: Router,
    private authService: AuthService,
    private carritoService: CarritoService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {
    this.refreshUser();
    this.refreshCartCount();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.refreshUser();
      this.refreshCartCount();
    });

    effect(() => {
      this.carritoService.carritoActualizado();
      this.refreshCartCount();
    });
  }

  refreshUser(): void {
    this.user.set(this.authService.getCurrentUser());
  }

  refreshCartCount(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.cartCount.set(0);
      return;
    }

    this.carritoService.getCarrito(usuario.usu_id).subscribe({
      next: (data) => {
        const total = (data?.items ?? []).reduce((acc, item) => acc + item.dca_can, 0);
        this.cartCount.set(total);
      },
      error: () => this.cartCount.set(0),
    });
  }

  irAlCarrito(): void {
    this.router.navigate(['/checkout']);
  }

  userInitial = computed(() => {
    const u = this.user();
    return u ? u.usu_nom.charAt(0).toUpperCase() : '?';
  });

  modeLabel = computed(() => {
    switch (this.user()?.rol_nom) {
      case 'administrador':
      case 'admin':
        return 'Modo admin';
      case 'bodeguero':
        return 'Modo bodeguero';
      default:
        return null;
    }
  });

  modeIcon = computed(() => {
    switch (this.user()?.rol_nom) {
      case 'administrador':
      case 'admin':
        return 'fa-solid fa-shield-halved';
      case 'bodeguero':
        return 'fa-solid fa-warehouse';
      default:
        return '';
    }
  });

  modeRoute = computed(() => {
    switch (this.user()?.rol_nom) {
      case 'administrador':
      case 'admin':
        return '/admin';
      case 'bodeguero':
        return '/bodega';
      default:
        return null;
    }
  });

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  buscarProducto(): void {
    const term = this.searchTerm().trim();
    if (!term) return;
    this.router.navigate(['/productos/buscar'], { queryParams: { q: term } });
  }

  logout(): void {
    this.authService.logout();
    this.user.set(null);
    this.closeDropdown();
    this.router.navigate(['/authentication']);
  }
}
