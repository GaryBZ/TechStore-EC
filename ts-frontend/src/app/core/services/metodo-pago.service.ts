import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetodoPagoModel } from '../models/metodo-pago.model';
import { environment } from '../../environment/environment';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class MetodoPagoService {
  private readonly base = `${environment.apiUrl}/metodos-pago`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll(): Observable<MetodoPagoModel[]> {
    return this.http
      .get<ApiResponse<MetodoPagoModel[]>>(this.base)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }
}