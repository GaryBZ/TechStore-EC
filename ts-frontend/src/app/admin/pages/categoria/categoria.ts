import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  products: number;
}

@Component({
  selector: 'app-categoria',
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria {
  categories: Category[] = [
    { id: 1, name: 'Gaming', products: 14 },
    { id: 2, name: 'Audio', products: 9 },
    { id: 3, name: 'Mouse', products: 6 },
    { id: 4, name: 'Teclado', products: 11 },
    { id: 5, name: 'CPU', products: 8 },
    { id: 6, name: 'GPU', products: 5 },
    { id: 7, name: 'RAM', products: 3 },
    { id: 8, name: 'SSD', products: 4 },
    { id: 9, name: '4k', products: 2 },
  ];

  nextId = 11;
  editingId: number | null = null;
  confirmingId: number | null = null;

  search = '';
  newBrand = '';
  editBrand = '';

  addOpen = false;

  get filteredCategories(): Category[] {
    return this.categories.filter((b) => b.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  saveBrand(): void {
    const value = this.newBrand.trim();

    if (!value) {
      alert('El nombre no puede estar vacío');
      return;
    }

    if (this.categories.some((b) => b.name.toLowerCase() === value.toLowerCase())) {
      alert('La Categoria ya existe');
      return;
    }

    this.categories.unshift({
      id: this.nextId++,
      name: value,
      products: 0,
    });

    this.newBrand = '';
    this.addOpen = false;
  }

  startEdit(brand: Category): void {
    this.addOpen = false;

    this.editingId = brand.id;
    this.editBrand = brand.name;
  }

  saveEdit(id: number): void {
    const value = this.editBrand.trim();

    if (!value) return;

    const exists = this.categories.some(
      (b) => b.id !== id && b.name.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      alert('La Categoria ya existe');
      return;
    }

    const brand = this.categories.find((b) => b.id === id);

    if (brand) {
      brand.name = this.editBrand.trim();
    }

    this.cancelEdit();
  }

  startConfirm(id: number): void {
    this.confirmingId = id;
  }

  deleteBrand(id: number): void {
    this.categories = this.categories.filter((brand) => brand.id !== id);

    this.confirmingId = null;
  }

  cancelAdd(): void {
    this.addOpen = false;
    this.newBrand = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editBrand = '';
  }

  openAdd(): void {
    this.cancelEdit();
    this.addOpen = true;
  }
}
