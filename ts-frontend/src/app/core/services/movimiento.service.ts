import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { MovimientoModel } from '../models/movimiento.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly baseUrl = `${environment.apiUrl}/movimientos`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<MovimientoModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<MovimientoModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  getByProducto(prd_id: number) {
    return this.http
      .get<ApiResponse<MovimientoModel[]>>(`${this.baseUrl}/producto/${prd_id}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  create(data: Omit<MovimientoModel, 'mov_id' | 'mov_fec'>) {
    return this.http
      .post<ApiResponse<MovimientoModel>>(this.baseUrl, data)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  update(id: number, data: Partial<MovimientoModel>) {
    return this.http
      .put<ApiResponse<MovimientoModel>>(`${this.baseUrl}/${id}`, data)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/${id}`);
  }
}