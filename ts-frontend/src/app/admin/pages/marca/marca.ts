import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Brand {
  id: number;
  name: string;
  products: number;
}

@Component({
  selector: 'app-marca',
  imports: [FormsModule, CommonModule],
  templateUrl: './marca.html',
  styleUrl: './marca.css',
})
export class Marca {
  brands: Brand[] = [
    { id: 1, name: 'ASUS', products: 14 },
    { id: 2, name: 'Corsair', products: 9 },
    { id: 3, name: 'NVIDIA', products: 6 },
    { id: 4, name: 'AMD', products: 11 },
    { id: 5, name: 'Samsung', products: 8 },
    { id: 6, name: 'Logitech', products: 5 },
    { id: 7, name: 'Sennheiser', products: 3 },
    { id: 8, name: 'NZXT', products: 4 },
    { id: 9, name: 'G.Skill', products: 2 },
    { id: 10, name: 'Intel', products: 7 },
  ];

  nextId = 11;
  editingId: number | null = null;
  confirmingId: number | null = null;

  search = '';
  newBrand = '';
  editBrand = '';

  addOpen = false;

  get filteredBrands(): Brand[] {
    return this.brands.filter((b) => b.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  saveBrand(): void {
    const value = this.newBrand.trim();

    if (!value) {
      alert('El nombre no puede estar vacío');
      return;
    }

    if (this.brands.some((b) => b.name.toLowerCase() === value.toLowerCase())) {
      alert('La marca ya existe');
      return;
    }

    this.brands.unshift({
      id: this.nextId++,
      name: value,
      products: 0,
    });

    this.newBrand = '';
    this.addOpen = false;
  }

  startEdit(brand: Brand): void {
    this.addOpen = false;

    this.editingId = brand.id;
    this.editBrand = brand.name;
  }

  saveEdit(id: number): void {
    const value = this.editBrand.trim();

    if (!value) return;

    const exists = this.brands.some(
      (b) => b.id !== id && b.name.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      alert('La marca ya existe');
      return;
    }

    const brand = this.brands.find((b) => b.id === id);

    if (brand) {
      brand.name = this.editBrand.trim();
    }

    this.cancelEdit();
  }

  startConfirm(id: number): void {
    this.confirmingId = id;
  }

  deleteBrand(id: number): void {
    this.brands = this.brands.filter((brand) => brand.id !== id);

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
