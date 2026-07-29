import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioModel } from '../../../core/models/usuario.model';
import { NotificacionBell } from "../notificacion-bell/notificacion-bell";

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NotificacionBell],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user = signal<UsuarioModel | null>(null);

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  logout(): void {
    this.authService.logout();
    this.user.set(null);
    this.router.navigate(['/authentication']);
  }
}
