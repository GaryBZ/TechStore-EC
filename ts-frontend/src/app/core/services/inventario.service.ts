import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { InventarioModel } from '../models/inventario.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly baseUrl = `${environment.apiUrl}/inventario`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<InventarioModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<InventarioModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  getByProducto(prd_id: number) {
    return this.http
      .get<ApiResponse<InventarioModel>>(`${this.baseUrl}/producto/${prd_id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  create(data: Omit<InventarioModel, 'inv_id' | 'inv_fec_act'>) {
    return this.http
      .post<ApiResponse<InventarioModel>>(this.baseUrl, data)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  update(id: number, data: Partial<InventarioModel>) {
    return this.http
      .put<ApiResponse<InventarioModel>>(`${this.baseUrl}/${id}`, data)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  delete(id: number, usu_id_actor: number) {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/${id}`, {
      body: { usu_id_actor },
    });
  }
}
