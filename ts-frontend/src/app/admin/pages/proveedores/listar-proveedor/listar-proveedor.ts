import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProveedorService } from '../../../../core/services/proveedor.service';
import { ProveedorModel } from '../../../../core/models/proveedor.model';

@Component({
  selector: 'app-listar-proveedor',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-proveedor.html',
  styleUrl: './listar-proveedor.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListarProveedor implements OnInit {
  proveedores: ProveedorModel[] = [];
  search = '';
  filterCat = '';
  filterMar = '';
  loading = false;

  constructor(
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.loading = true;
    this.proveedorService.getAll().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando proveedores', err);
        this.loading = false;
      },
    });
  }

  get filteredProveedores(): ProveedorModel[] {
    return this.proveedores.filter(
      (p) => p?.pro_emp && p.pro_emp.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  deleteProduct(id: number): void {
    if (!confirm('¿Eliminar este proveedor?')) return;

    this.proveedorService.remove(id).subscribe({
      next: () => {
        this.proveedores = this.proveedores.filter((p) => p.pro_id !== id);
        this.showToast('Proveedor eliminado');
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
    this.router.navigate(['/admin/proveedores', id]);
  }

  goToCreate(): void {
    this.router.navigate(['/admin/proveedores/crear']);
  }
}