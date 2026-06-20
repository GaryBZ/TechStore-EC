import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, FormsModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  tab = signal<'login' | 'register'>('login');

  loginLoading = signal(false);
  loginSuccess = signal(false);
  registerLoading = signal(false);
  registerSuccess = signal(false);
  errorMsg = signal('');

  // Login form
  loginEmail = '';
  loginPassword = '';

  // Register form
  regNombre = '';
  regApellido = '';
  regCorreo = '';
  regPassword = '';
  regAceptaTerminos = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  loginBtnLabel = computed(() => {
    if (this.loginLoading()) return 'Ingresando...';
    if (this.loginSuccess()) return '¡Listo!';
    return 'Ingresar';
  });

  loginBtnIcon = computed(() => {
    if (this.loginLoading()) return 'fa-solid fa-spinner fa-spin';
    if (this.loginSuccess()) return 'fa-solid fa-check';
    return 'fa-solid fa-arrow-right-to-bracket';
  });

  setTab(tab: 'login' | 'register'): void {
    this.tab.set(tab);
    this.errorMsg.set('');
  }

  handleLogin(): void {
    if (this.loginLoading() || this.loginSuccess()) return;

    if (!this.loginEmail || !this.loginPassword) {
      this.errorMsg.set('Completa correo y contraseña');
      return;
    }

    this.errorMsg.set('');
    this.loginLoading.set(true);

    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: (user) => {
        this.loginLoading.set(false);
        this.loginSuccess.set(true);

        if (user) {
          this.authService.saveSession(user);

          setTimeout(() => {
            if (user.rol_nom === 'administrador') {
              this.router.navigate(['/admin']);
            } else if (user.rol_nom === 'bodeguero') {
              this.router.navigate(['/admin/inventario']);
            } else {
              this.router.navigate(['/inicio']);
            }
          }, 1000);
        }
      },
      error: (err) => {
        this.loginLoading.set(false);
        this.errorMsg.set(err.error?.message || 'Error al iniciar sesión');
      },
    });
  }

  handleRegister(): void {
    if (this.registerLoading() || this.registerSuccess()) return;

    if (!this.regNombre || !this.regApellido || !this.regCorreo || !this.regPassword) {
      this.errorMsg.set('Completa todos los campos');
      return;
    }
    if (!this.regAceptaTerminos) {
      this.errorMsg.set('Debes aceptar los términos de servicio');
      return;
    }
    if (this.regPassword.length < 8) {
      this.errorMsg.set('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    this.errorMsg.set('');
    this.registerLoading.set(true);

    this.authService
      .register({
        usu_nom: this.regNombre,
        usu_ape: this.regApellido,
        usu_cor: this.regCorreo,
        usu_pas: this.regPassword,
      })
      .subscribe({
        next: (user) => {
          this.registerLoading.set(false);
          this.registerSuccess.set(true);

          if (user) {
            this.authService.saveSession(user);
            setTimeout(() => this.router.navigate(['/inicio']), 1000);
          }
        },
        error: (err) => {
          this.registerLoading.set(false);
          this.errorMsg.set(err.error?.message || 'Error al crear la cuenta');
        },
      });
  }
}