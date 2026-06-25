import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetodoPagoService } from '../../../core/services/metodo-pago.service';
import { TarjetaService } from '../../../core/services/tarjeta.service';
import { MarcaTarjeta, TarjetaModel } from '../../../core/models/tarjeta.model';
import { MetodoPagoModel } from '../../../core/models/metodo-pago.model';
import { AuthService } from '../../../core/services/auth.service';

interface NuevaTarjetaForm {
  titular: string;
  numero: string;
  vencimiento: string;
  cvv: string;
  mpg_id: number | null;
  alias: string;
}

@Component({
  selector: 'app-metodos-pago',
  imports: [CommonModule, FormsModule],
  templateUrl: './metodos-pago.html',
  styleUrl: './metodos-pago.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MetodosPago implements OnInit {
  metodosPago: MetodoPagoModel[] = [];
  tarjetas = signal<TarjetaModel[]>([]);
  loading = false;

  modalAbierto = false;
  guardando = false;
  errores: Partial<Record<keyof NuevaTarjetaForm, string>> = {};

  form: NuevaTarjetaForm = {
    titular: '',
    numero: '',
    vencimiento: '',
    cvv: '',
    mpg_id: null,
    alias: '',
  };

  marcaDetectada: MarcaTarjeta = 'desconocida';

  constructor(
    private metodoPagoService: MetodoPagoService,
    private tarjetaService: TarjetaService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarMetodos();
    this.cargarTarjetas();
  }

  cargarMetodos(): void {
    this.metodoPagoService.getAll().subscribe({
      next: (data) => {
        this.metodosPago = data.filter((m) => m.mpg_est === 'A');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando métodos de pago', err),
    });
  }

  cargarTarjetas(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.loading = true;
    this.tarjetaService.getByUsuario(usuario.usu_id).subscribe({
      next: (data) => {
        this.tarjetas.set(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando tarjetas', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getMetodoNombre(mpg_id: number | null): string {
    return this.metodosPago.find((m) => m.mpg_id === mpg_id)?.mpg_nom ?? '—';
  }

  // ---------- Modal ----------

  abrirModal(): void {
    this.form = { titular: '', numero: '', vencimiento: '', cvv: '', mpg_id: null, alias: '' };
    this.errores = {};
    this.marcaDetectada = 'desconocida';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    if (this.guardando) return;
    this.modalAbierto = false;
  }

  onNumeroInput(): void {
    const soloDigitos = this.form.numero.replace(/[^0-9]/g, '').slice(0, 16);
    this.form.numero = soloDigitos.replace(/(.{4})/g, '$1 ').trim();
    this.marcaDetectada = this.detectarMarca(soloDigitos);
  }

  onVencimientoInput(): void {
    let v = this.form.vencimiento.replace(/[^0-9]/g, '').slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    this.form.vencimiento = v;
  }

  onCvvInput(): void {
    this.form.cvv = this.form.cvv.replace(/[^0-9]/g, '').slice(0, 4);
  }

  detectarMarca(numero: string): MarcaTarjeta {
    if (/^4/.test(numero)) return 'visa';
    if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01])\d{2})/.test(numero)) return 'mastercard';
    return 'desconocida';
  }

  private luhnValido(numero: string): boolean {
    let suma = 0;
    let alternar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
      let n = parseInt(numero[i], 10);
      if (alternar) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      suma += n;
      alternar = !alternar;
    }
    return suma % 10 === 0;
  }

  private vencimientoValido(venc: string): boolean {
    const match = /^(\d{2})\/(\d{2})$/.exec(venc);
    if (!match) return false;
    const mes = parseInt(match[1], 10);
    const anio = 2000 + parseInt(match[2], 10);
    if (mes < 1 || mes > 12) return false;
    const ahora = new Date();
    const expira = new Date(anio, mes, 0); // último día de ese mes
    return expira >= new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  }

  private validarForm(): boolean {
    const e: typeof this.errores = {};

    if (this.form.titular.trim().length < 3) {
      e.titular = 'Ingresa el nombre como aparece en la tarjeta';
    }

    const numero = this.form.numero.replace(/\s/g, '');
    if (numero.length !== 16) {
      e.numero = 'El número debe tener 16 dígitos';
    } else if (this.marcaDetectada === 'desconocida') {
      e.numero = 'Por ahora solo aceptamos Visa o Mastercard';
    }

    if (!this.vencimientoValido(this.form.vencimiento)) {
      e.vencimiento = 'Fecha inválida o tarjeta vencida (MM/YY)';
    }

    const cvvLen = this.form.cvv.length;
    if (cvvLen < 3 || cvvLen > 4) {
      e.cvv = 'El CVV debe tener 3 o 4 dígitos';
    }

    if (!this.form.mpg_id) {
      e.mpg_id = 'Selecciona un tipo de método de pago';
    }

    this.errores = e;
    return Object.keys(e).length === 0;
  }

  guardar(): void {
    if (!this.validarForm()) return;
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.guardando = true;
    this.tarjetaService
      .create({
        usu_id: usuario.usu_id,
        mpg_id: this.form.mpg_id!,
        tar_alias: this.form.alias.trim() || null,
        tar_ult4: this.form.numero.replace(/\s/g, '').slice(-4),
        tar_marca: this.marcaDetectada,
        tar_titu: this.form.titular.trim(),
        tar_venc: this.form.vencimiento,
      })
      .subscribe({
        next: () => {
          this.cargarTarjetas();
          this.guardando = false;
          this.modalAbierto = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error guardando tarjeta', err);
          this.guardando = false;
          this.errores.numero = 'No se pudo guardar la tarjeta. Intenta de nuevo.';
          this.cdr.detectChanges();
        },
      });
  }

  eliminar(tar_id: number): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario) return;

    this.tarjetaService.delete(tar_id, usuario.usu_id).subscribe({
      next: () => this.cargarTarjetas(),
      error: (err) => console.error('Error eliminando tarjeta', err),
    });
  }
}
