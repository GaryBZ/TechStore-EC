import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

interface MetricasDashboard {
  pedidos_pendientes: number;
  pedidos_hoy: number;
  ventas_hoy: number;
  usuarios_activos: number;
  productos_bajo_stock: number;
}

interface RespaldoModel {
  res_id: number;
  res_fec: string;
  res_tipo: string;
  res_archivo: string;
}


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Dashboard implements OnInit {
  metricas: MetricasDashboard | null = null;
  loadingMetricas = false;

  ultimoRespaldo: RespaldoModel | null = null;
  historialRespaldos: RespaldoModel[] = [];
  ejecutandoRespaldo = false;
  loadingHistorial = false;
  mostrarHistorial = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMetricas();
    this.cargarUltimoRespaldo();
  }

  cargarMetricas(): void {
    this.loadingMetricas = true;
    this.http.get<any>(`${environment.apiUrl}/dashboard/metricas`).subscribe({
      next: (res) => {
        this.metricas = res.data;
        this.loadingMetricas = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando métricas', err);
        this.loadingMetricas = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarUltimoRespaldo(): void {
    this.http.get<any>(`${environment.apiUrl}/backup/ultimo`).subscribe({
      next: (res) => {
        this.ultimoRespaldo = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando respaldo', err),
    });
  }

  get diasDesdeUltimoRespaldo(): number | null {
    if (!this.ultimoRespaldo?.res_fec) return null;
    const fecha = new Date(this.ultimoRespaldo.res_fec);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  get estadoRespaldo(): 'ok' | 'alerta' | 'critico' {
    const dias = this.diasDesdeUltimoRespaldo;
    if (dias === null) return 'critico';
    if (dias <= 1) return 'ok';
    if (dias <= 3) return 'alerta';
    return 'critico';
  }

  ejecutarRespaldo(): void {
    if (!confirm('¿Ejecutar un respaldo manual de la base de datos ahora?')) return;

    this.ejecutandoRespaldo = true;
    this.http.post<any>(`${environment.apiUrl}/backup/ejecutar`, {}).subscribe({
      next: () => {
        this.ejecutandoRespaldo = false;
        this.cargarUltimoRespaldo();
        if (this.mostrarHistorial) this.cargarHistorial();
        alert('Respaldo ejecutado correctamente');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.ejecutandoRespaldo = false;
        alert(err.error?.message || 'Error al ejecutar el respaldo');
        this.cdr.detectChanges();
      },
    });
  }

  toggleHistorial(): void {
    this.mostrarHistorial = !this.mostrarHistorial;
    if (this.mostrarHistorial && this.historialRespaldos.length === 0) {
      this.cargarHistorial();
    }
  }

  cargarHistorial(): void {
    this.loadingHistorial = true;
    this.http.get<any>(`${environment.apiUrl}/backup/historial`).subscribe({
      next: (res) => {
        this.historialRespaldos = res.data;
        this.loadingHistorial = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.loadingHistorial = false;
        this.cdr.detectChanges();
      },
    });
  }
}
