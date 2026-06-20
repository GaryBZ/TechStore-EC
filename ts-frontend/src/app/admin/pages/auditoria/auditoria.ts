import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaModel } from '../../../core/models/auditoria.model';
import { AuditoriaService } from '../../../core/services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  imports: [FormsModule, CommonModule],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Auditoria implements OnInit {
  auditorias: AuditoriaModel[] = [];
  search = '';
  filterTabla = '';
  filterAccion = '';
  loading = false;

  constructor(
    private auditoriaService: AuditoriaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAuditoria();
  }

  loadAuditoria(): void {
    this.loading = true;
    this.auditoriaService.getAll().subscribe({
      next: (data) => {
        this.auditorias = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando auditoría', err);
        this.loading = false;
      },
    });
  }

  formatJson(value: any): string {
    if (!value) return '—';
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  get tablas(): string[] {
    return [...new Set(this.auditorias.map((a) => a.aud_tab))].sort();
  }

  get filteredAuditoria(): AuditoriaModel[] {
    return this.auditorias.filter((a) => {
      const matchSearch =
        !this.search ||
        a.aud_tab.toLowerCase().includes(this.search.toLowerCase()) ||
        String(a.usu_id ?? '').includes(this.search);
      const matchTabla = !this.filterTabla || a.aud_tab === this.filterTabla;
      const matchAccion = !this.filterAccion || a.aud_acc === this.filterAccion;
      return matchSearch && matchTabla && matchAccion;
    });
  }
}
