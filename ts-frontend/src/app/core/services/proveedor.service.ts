import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ProveedorModel } from '../models/proveedor.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly baseUrl = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<ProveedorModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<ProveedorModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  create(producto: Omit<ProveedorModel, 'pro_id' | 'pro_fec_cre'>) {
    return this.http
      .post<ApiResponse<ProveedorModel>>(this.baseUrl, producto)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  update(id: number, producto: Partial<ProveedorModel>) {
    return this.http
      .put<ApiResponse<ProveedorModel>>(`${this.baseUrl}/${id}`, producto)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  remove(id: number) {
    return this.http
      .delete<ApiResponse<ProveedorModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }
}