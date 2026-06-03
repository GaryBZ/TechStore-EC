import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, FormsModule ],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {

  mode = signal<'client' | 'admin'>('client');
  tab  = signal<'login' | 'register'>('login');

  loginLoading  = signal(false);
  loginSuccess  = signal(false);
  showLoginPw   = signal(false);
  showRegisterPw = signal(false);

  isAdmin  = computed(() => this.mode() === 'admin');
  isClient = computed(() => this.mode() === 'client');

  constructor( private router: Router) {}

  rightLabel = computed(() =>
    this.isAdmin() ? 'Panel de administración' : 'E-commerce de hardware'
  );

  rightHeadingMain = computed(() =>
    this.isAdmin() ? 'Control total sobre' : 'Compra GPUs, CPUs y más'
  );

  rightHeadingAccent = computed(() =>
    this.isAdmin() ? 'la plataforma.' : 'al instante.'
  );

  rightSub = computed(() =>
    this.isAdmin()
      ? 'Accede al panel de gestión, monitoreo en tiempo real y administración de productos.'
      : 'Compra productos y recíbelo en tiempo record.'
  );

  loginTitle = computed(() =>
    this.isAdmin() ? 'Acceso de administrador' : 'Bienvenido de vuelta'
  );

  loginSub = computed(() =>
    this.isAdmin() ? 'Solo personal autorizado.' : 'Accede a tu cuenta para continuar.'
  );

  loginBtnLabel = computed(() => {
    if (this.loginLoading()) return 'Ingresando...';
    if (this.loginSuccess()) {
      this.router.navigate(['/inicio']);
      return '¡Listo!';
    }
    return 'Ingresar';
  });

  loginBtnIcon = computed(() => {
    if (this.loginLoading()) return 'fa-solid fa-spinner fa-spin';
    if (this.loginSuccess()) return 'fa-solid fa-check';
    return 'fa-solid fa-arrow-right-to-bracket';
  });

  // ── Actions ────────────────────────────────────────────
  setMode(mode: 'client' | 'admin'): void {
    this.mode.set(mode);
    if (mode === 'admin') {
      this.tab.set('login'); // admins can't self-register
    }
  }

  setTab(tab: 'login' | 'register'): void {
    if (this.isAdmin() && tab === 'register') return;
    this.tab.set(tab);
  }

  toggleLoginPw(): void {
    this.showLoginPw.update(v => !v);
  }

  toggleRegisterPw(): void {
    this.showRegisterPw.update(v => !v);
  }

  handleLogin(): void {
    if (this.loginLoading() || this.loginSuccess()) return;
    this.loginLoading.set(true);
    setTimeout(() => {
      this.loginLoading.set(false);
      this.loginSuccess.set(true);
      setTimeout(() => {
        this.loginSuccess.set(false);
      }, 1500);
    }, 1200);
  }
}