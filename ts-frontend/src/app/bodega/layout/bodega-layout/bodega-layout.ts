import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-bodega-layout',
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './bodega-layout.html',
  styleUrl: './bodega-layout.css',
})
export class BodegaLayout {}
