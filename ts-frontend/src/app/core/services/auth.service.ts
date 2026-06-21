import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { UsuarioModel } from '../models/usuario.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  usu_nom: string;
  usu_ape: string;
  usu_cor: string;
  usu_pas: string;
  usu_tel?: string;
  usu_ced?: string;
  ciu_id?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  login(payload: LoginPayload) {
    return this.http
      .post<ApiResponse<UsuarioModel>>(`${this.baseUrl}/login`, payload)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  register(payload: RegisterPayload) {
    return this.http
      .post<ApiResponse<UsuarioModel>>(`${this.baseUrl}/register`, payload)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  saveSession(user: UsuarioModel): void {
    if (user.token) localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): UsuarioModel | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}