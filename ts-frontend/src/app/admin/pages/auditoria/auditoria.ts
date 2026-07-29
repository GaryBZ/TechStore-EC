import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditoriaModel, claseNivel, getNivelCriticidad } from '../../../core/models/auditoria.model';
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
 
  getNombreUsuario(aud: AuditoriaModel): string {
    if (!aud.usu_id) return 'Sistema';
    if (!aud.usu_nom) return `Usuario #${aud.usu_id}`;
    return `${aud.usu_nom} ${aud.usu_ape ?? ''}`.trim();
  }
 
  // Requiere que el backend/SP incluya rol_nom en el join (ver nota aparte)
  getRolUsuario(aud: AuditoriaModel): string {
    return (aud as any).rol_nom ?? '—';
  }
 
  getNivel(aud: AuditoriaModel): string {
    return getNivelCriticidad(aud.aud_tab, aud.aud_acc) ?? '—';
  }
 
  getClaseNivel(aud: AuditoriaModel): string {
    return claseNivel   (getNivelCriticidad(aud.aud_tab, aud.aud_acc));
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