import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaModel } from '../../../core/models/categoria.model';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categoria',
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Categoria implements OnInit {
  categories: CategoriaModel[] = [];
  editingId: number | null = null;
  search = '';
  newBrand = '';
  editBrand = '';
  addOpen = false;
  loading = false;

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges(); // <- fuerza renderizado
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      },
    });
  }

  get filteredCategories(): CategoriaModel[] {
    return this.categories.filter(
      (c) => c?.cat_nom && c.cat_nom.toLowerCase().includes(this.search.toLowerCase()),
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

    this.categoriaService.create({ cat_nom: value, cat_des: null, cat_est: 'A' }).subscribe({
      next: (data) => {
        if (data) this.categories.unshift(data);
        this.newBrand = '';
        this.addOpen = false;
        this.showToast('Categoría creada');
        this.cdr.detectChanges(); // <- agregar
      },
      error: (err) => alert(err.error?.message || 'Error al crear'),
    });
  }

  startEdit(categoria: CategoriaModel): void {
    this.addOpen = false;
    this.editingId = categoria.cat_id;
    this.editBrand = categoria.cat_nom;
  }

  saveEdit(id: number): void {
    const value = this.editBrand.trim();
    if (!value) return;

    this.categoriaService.update(id, { cat_nom: value }).subscribe({
      next: (data) => {
        if (data) {
          const i = this.categories.findIndex((c) => c.cat_id === id);
          if (i !== -1) this.categories[i] = data;
        }
        this.cancelEdit();
        this.showToast('Categoría actualizada');
        this.cdr.detectChanges(); // <- agregar
      },
      error: (err) => alert(err.error?.message || 'Error al actualizar'),
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editBrand = '';
  }

  deleteBrand(id: number): void {
    if (!confirm('¿Eliminar esta categoría?')) return;

    this.categoriaService.remove(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c.cat_id !== id);
        this.showToast('Categoría eliminada');
        this.cdr.detectChanges(); // <- agregar
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
