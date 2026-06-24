import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/authentication']);
      return false;
    }

    const rolNormalizado = user.rol_nom === 'admin' ? 'administrador' : user.rol_nom;

    if (!allowedRoles.includes(rolNormalizado)) {
      router.navigate(['/inicio']);
      return false;
    }

    return true;
  };
};