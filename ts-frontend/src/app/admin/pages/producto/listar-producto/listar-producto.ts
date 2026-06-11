import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-producto',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './listar-producto.html',
  styleUrl: './listar-producto.css',
})
export class ListarProducto {}
