import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

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

interface VentaDiaria {
  dia: string;
  total: number;
}

interface PedidoPorEstado {
  epd_nom: string;
  cantidad: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Dashboard implements OnInit {
  @ViewChild('ventasCanvas') ventasCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('estadosCanvas') estadosCanvas!: ElementRef<HTMLCanvasElement>;

  metricas: MetricasDashboard | null = null;
  loadingMetricas = false;

  ultimoRespaldo: RespaldoModel | null = null;
  historialRespaldos: RespaldoModel[] = [];
  ejecutandoRespaldo = false;
  loadingHistorial = false;
  mostrarHistorial = false;
  modalRestaurarAbierto = false;
  archivoARestaurar: string | null = null;
  textoConfirmacion = '';
  restaurando = false;

  private chartVentas: Chart | null = null;
  private chartEstados: Chart | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMetricas();
    this.cargarUltimoRespaldo();
    this.cargarVentasSemana();
    this.cargarPedidosPorEstado();
  }

  abrirModalRestaurar(archivo: string): void {
    this.archivoARestaurar = archivo;
    this.textoConfirmacion = '';
    this.modalRestaurarAbierto = true;
  }

  cerrarModalRestaurar(): void {
    if (this.restaurando) return;
    this.modalRestaurarAbierto = false;
    this.archivoARestaurar = null;
    this.textoConfirmacion = '';
  }

  confirmarRestauracion(): void {
    if (this.textoConfirmacion !== 'CONFIRMAR' || !this.archivoARestaurar) return;

    this.restaurando = true;
    this.http
      .post<any>(`${environment.apiUrl}/backup/restaurar`, {
        archivo: this.archivoARestaurar,
        confirmacion: this.textoConfirmacion,
      })
      .subscribe({
        next: (res) => {
          this.restaurando = false;
          this.modalRestaurarAbierto = false;
          alert(res.message || 'Base de datos restaurada correctamente. Recarga la página.');
          window.location.reload();
        },
        error: (err) => {
          this.restaurando = false;
          alert(err.error?.message || 'Error al restaurar el respaldo');
        },
      });
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

  cargarVentasSemana(): void {
    this.http.get<any>(`${environment.apiUrl}/dashboard/ventas-semana`).subscribe({
      next: (res) => {
        setTimeout(() => this.renderVentasChart(res.data ?? []));
      },
      error: (err) => console.error('Error cargando ventas semanales', err),
    });
  }

  cargarPedidosPorEstado(): void {
    this.http.get<any>(`${environment.apiUrl}/dashboard/pedidos-por-estado`).subscribe({
      next: (res) => {
        setTimeout(() => this.renderEstadosChart(res.data ?? []));
      },
      error: (err) => console.error('Error cargando pedidos por estado', err),
    });
  }

  private renderVentasChart(datos: VentaDiaria[]): void {
    if (!this.ventasCanvas) return;
    if (this.chartVentas) this.chartVentas.destroy();

    const labels = datos.map((d) => {
      const fecha = new Date(d.dia);
      return fecha.toLocaleDateString('es-EC', { weekday: 'short', day: 'numeric' });
    });
    const valores = datos.map((d) => d.total);

    this.chartVentas = new Chart(this.ventasCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Ventas ($)',
            data: valores,
            backgroundColor: 'rgba(124, 58, 237, 0.5)',
            borderColor: '#7c3aed',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#888' }, grid: { color: '#222' } },
          y: { ticks: { color: '#888' }, grid: { color: '#222' } },
        },
      },
    });
  }

  private renderEstadosChart(datos: PedidoPorEstado[]): void {
    if (!this.estadosCanvas) return;
    if (this.chartEstados) this.chartEstados.destroy();

    const labels = datos.map((d) => d.epd_nom);
    const valores = datos.map((d) => d.cantidad);

    this.chartEstados = new Chart(this.estadosCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: valores,
            backgroundColor: ['#7c3aed', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#888', font: { size: 11 } } },
        },
      },
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
