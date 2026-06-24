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

interface EditForm {
  usu_nom: string;
  usu_ape: string;
  usu_tel: string;
  usu_dir: string;
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
  editando = false;
  guardando = false;
  guardadoOk = false;

  form: EditForm = { usu_nom: '', usu_ape: '', usu_tel: '', usu_dir: '' };
  errores: Partial<Record<keyof EditForm, string>> = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario.set(this.authService.getCurrentUser());
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
    this.form = {
      usu_nom: u.usu_nom ?? '',
      usu_ape: u.usu_ape ?? '',
      usu_tel: u.usu_tel ?? '',
      usu_dir: u.usu_dir ?? '',
    };
    this.errores = {};
    this.guardadoOk = false;
    this.editando = true;
  }

  cancelarEdicion(): void {
    if (this.guardando) return;
    this.editando = false;
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
      })
      .subscribe({
        next: (actualizado) => {
          const merged: UsuarioModel = {
            ...actual,
            ...(actualizado ?? {}),
            usu_nom: this.form.usu_nom.trim(),
            usu_ape: this.form.usu_ape.trim(),
            usu_tel: this.form.usu_tel.trim() || null,
            usu_dir: this.form.usu_dir.trim() || null,
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
