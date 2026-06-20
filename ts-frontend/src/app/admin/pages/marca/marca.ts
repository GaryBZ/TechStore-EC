import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarcaModel } from '../../../core/models/marca.model';
import { MarcaService } from '../../../core/services/marca.service';

@Component({
  selector: 'app-marca',
  imports: [FormsModule, CommonModule],
  templateUrl: './marca.html',
  styleUrl: './marca.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Marca implements OnInit {
  brands: MarcaModel[] = [];
  editingId: number | null = null;
  search = '';
  newBrand = '';
  editBrand = '';
  addOpen = false;
  loading = false;

constructor(
    private marcaService: MarcaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMarcas();
  }

  loadMarcas(): void {
    this.marcaService.getAll().subscribe({
      next: (data) => {
        this.brands = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando marcas', err);
      },
    });
  }

  get filteredBrands(): MarcaModel[] {
    return this.brands.filter(
      (c) => c?.mar_nom && c.mar_nom.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  openAdd(): void {
    this.cancelEdit();
    this.addOpen = true;
  }

  cancelAdd(): void {
    this.addOpen = false;
    this.newBrand = '';
  }

  saveBrand(): void {
    const value = this.newBrand.trim();
    if (!value) {
      alert('El nombre no puede estar vacío');
      return;
    }

    this.marcaService.create({ mar_nom: value, mar_des: null, mar_est: 'A' }).subscribe({
      next: (data) => {
        if (data) this.brands.unshift(data);
        this.newBrand = '';
        this.addOpen = false;
        this.showToast('Marca creada');
        this.cdr.detectChanges();
      },
      error: (err) => alert(err.error?.message || 'Error al crear'),
    });
  }

  startEdit(marca: MarcaModel): void {
    this.addOpen = false;
    this.editingId = marca.mar_id;
    this.editBrand = marca.mar_nom;
  }

  saveEdit(id: number): void {
    const value = this.editBrand.trim();
    if (!value) return;

    this.marcaService.update(id, { mar_nom: value }).subscribe({
      next: (data) => {
        if (data) {
          const i = this.brands.findIndex((c) => c.mar_id === id);
          if (i !== -1) this.brands[i] = data;
        }
        this.cancelEdit();
        this.showToast('Marca actualizada');
        this.cdr.detectChanges();
      },
      error: (err) => alert(err.error?.message || 'Error al actualizar'),
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editBrand = '';
  }

  deleteBrand(id: number): void {
    if (!confirm('¿Eliminar esta marcas?')) return;

    this.marcaService.remove(id).subscribe({
      next: () => {
        this.brands = this.brands.filter((c) => c.mar_id !== id);
        this.showToast('Marca eliminada');
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
