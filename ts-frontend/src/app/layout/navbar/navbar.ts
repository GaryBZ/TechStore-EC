import { Component, computed, ElementRef, HostListener, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioModel } from '../../core/models/usuario.model';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user = signal<UsuarioModel | null>(null);
  dropdownOpen = signal(false);
  searchTerm = signal('');

  constructor(
    private router: Router,
    private authService: AuthService,
    private el: ElementRef,
  ) {
    this.refreshUser();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.refreshUser();
    });
  }

  refreshUser(): void {
    this.user.set(this.authService.getCurrentUser());
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