import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioModel } from '../../../core/models/usuario.model';
import { CiudadModel } from '../../../core/models/ciudad.model';
import { ProvinciaModel } from '../../../core/models/provincia.model';
import { CiudadService } from '../../../core/services/ciudad.service';
import { ProvinciaService } from '../../../core/services/provincia.service';

interface EditForm {
  usu_nom: string;
  usu_ape: string;
  usu_tel: string;
  usu_dir: string;
  prv_id: number | null;
  ciu_id: number | null;
}
@Component({
  selector: 'app-mi-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MiPerfil implements OnInit {
  usuario = signal<UsuarioModel | null>(null);

  ciudades: CiudadModel[] = [];
  provincias: ProvinciaModel[] = [];

  editando = false;
  guardando = false;
  guardadoOk = false;

  form: EditForm = {
    usu_nom: '',
    usu_ape: '',
    usu_tel: '',
    usu_dir: '',
    prv_id: null,
    ciu_id: null,
  };
  errores: Partial<Record<keyof EditForm, string>> = {};

  ciudadesFiltradas: CiudadModel[] = [];

  constructor(
    private authService: AuthService,
    private ciudadService: CiudadService,
    private provinciaService: ProvinciaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.usuario.set(this.authService.getCurrentUser());
    console.log(
      'usu_fec_reg crudo:',
      this.usuario()?.usu_fec_reg,
      typeof this.usuario()?.usu_fec_reg,
    );
    this.cargarUbicaciones();
  }

  private cargarUbicaciones(): void {
    this.provinciaService.getAll().subscribe({
      next: (data) => {
        this.provincias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando provincias', err),
    });
    this.ciudadService.getAll().subscribe({
      next: (data) => {
        this.ciudades = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando ciudades', err),
    });
  }

  get iniciales(): string {
    const u = this.usuario();
    if (!u) return '?';
    const n = u.usu_nom?.charAt(0) ?? '';
    const a = u.usu_ape?.charAt(0) ?? '';
    return (n + a).toUpperCase() || '?';
  }

  get nombreCompleto(): string {
    const u = this.usuario();
    return u ? `${u.usu_nom} ${u.usu_ape}` : '';
  }

  get ciudadActual(): CiudadModel | null {
    const u = this.usuario();
    if (!u?.ciu_id) return null;
    return this.ciudades.find((c) => c.ciu_id === u.ciu_id) ?? null;
  }

  get provinciaActual(): ProvinciaModel | null {
    const ciu = this.ciudadActual;
    if (!ciu) return null;
    return this.provincias.find((p) => p.prv_id === ciu.prv_id) ?? null;
  }

  get ubicacionLabel(): string {
    const ciu = this.ciudadActual;
    const prv = this.provinciaActual;
    if (ciu && prv) return `${ciu.ciu_nom}, ${prv.prv_nom}`;
    if (ciu) return ciu.ciu_nom;
    return 'No registrada';
  }

  /**
   * Parsea fechas en formato "DD/MM/YYYY hh:mm:ss.SSS AM/PM"
   * porque no es un formato ISO que Date() entienda nativamente.
   */
  private parseFechaCustom(valor: string): Date | null {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\.(\d+)\s*(AM|PM)$/i.exec(
      valor.trim(),
    );
    if (!match) return null;

    const [, dd, mm, yyyy, hh, min, ss, , ampm] = match;
    let hora = parseInt(hh, 10);
    if (/pm/i.test(ampm) && hora < 12) hora += 12;
    if (/am/i.test(ampm) && hora === 12) hora = 0;

    return new Date(
      parseInt(yyyy, 10),
      parseInt(mm, 10) - 1,
      parseInt(dd, 10),
      hora,
      parseInt(min, 10),
      parseInt(ss, 10),
    );
  }

  get fechaRegistroLegible(): string {
    const u = this.usuario();
    if (!u?.usu_fec_reg) return '—';

    const fecha = new Date(u.usu_fec_reg);
    if (isNaN(fecha.getTime())) return '—';

    return fecha.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  get rolLabel(): string {
    const rol = this.usuario()?.rol_nom?.toLowerCase();
    switch (rol) {
      case 'administrador':
      case 'admin':
        return 'Administrador';
      case 'bodeguero':
        return 'Bodeguero';
      default:
        return 'Cliente';
    }
  }

  // ---------- Edición ----------

  abrirEdicion(): void {
    const u = this.usuario();
    if (!u) return;

    const ciu = this.ciudadActual;
    this.form = {
      usu_nom: u.usu_nom ?? '',
      usu_ape: u.usu_ape ?? '',
      usu_tel: u.usu_tel ?? '',
      usu_dir: u.usu_dir ?? '',
      prv_id: ciu?.prv_id ?? null,
      ciu_id: u.ciu_id ?? null,
    };
    this.onProvinciaChange(false);
    this.errores = {};
    this.guardadoOk = false;
    this.editando = true;
  }

  cancelarEdicion(): void {
    if (this.guardando) return;
    this.editando = false;
  }

  onProvinciaChange(limpiarCiudad = true): void {
    if (limpiarCiudad) this.form.ciu_id = null;
    this.ciudadesFiltradas = this.form.prv_id
      ? this.ciudades.filter((c) => c.prv_id === this.form.prv_id)
      : [];
  }

  onTelInput(): void {
    this.form.usu_tel = this.form.usu_tel.replace(/[^0-9+\s-]/g, '').slice(0, 15);
  }

  private validar(): boolean {
    const e: typeof this.errores = {};

    if (this.form.usu_nom.trim().length < 2) {
      e.usu_nom = 'El nombre debe tener al menos 2 caracteres';
    }
    if (this.form.usu_ape.trim().length < 2) {
      e.usu_ape = 'El apellido debe tener al menos 2 caracteres';
    }
    if (this.form.usu_tel && this.form.usu_tel.replace(/\D/g, '').length < 7) {
      e.usu_tel = 'Ingresa un teléfono válido (mínimo 7 dígitos)';
    }
    if (
      this.form.usu_dir &&
      this.form.usu_dir.trim().length > 0 &&
      this.form.usu_dir.trim().length < 5
    ) {
      e.usu_dir = 'La dirección parece muy corta';
    }

    this.errores = e;
    return Object.keys(e).length === 0;
  }

  guardar(): void {
    const actual = this.usuario();
    if (!actual || !this.validar()) return;

    this.guardando = true;
    this.authService
      .updateProfile(actual.usu_id, {
        usu_nom: this.form.usu_nom.trim(),
        usu_ape: this.form.usu_ape.trim(),
        usu_tel: this.form.usu_tel.trim() || null,
        usu_dir: this.form.usu_dir.trim() || null,
        ciu_id: this.form.ciu_id,
        usu_id_actor: actual.usu_id,
      } as any)
      .subscribe({
        next: (actualizado) => {
          const merged: UsuarioModel = {
            ...actual,
            ...(actualizado ?? {}),
            usu_nom: this.form.usu_nom.trim(),
            usu_ape: this.form.usu_ape.trim(),
            usu_tel: this.form.usu_tel.trim() || null,
            usu_dir: this.form.usu_dir.trim() || null,
            ciu_id: this.form.ciu_id,
          };
          this.authService.saveSession(merged);
          this.usuario.set(merged);
          this.guardando = false;
          this.editando = false;
          this.guardadoOk = true;
          setTimeout(() => (this.guardadoOk = false), 3000);
        },
        error: (err) => {
          console.error('Error actualizando perfil', err);
          this.guardando = false;
          this.errores.usu_nom = 'No se pudo guardar. Intenta de nuevo.';
        },
      });
  }
}
