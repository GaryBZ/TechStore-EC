import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductoModel } from '../models/producto.model';
import { environment } from '../../environment/environment';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<ProductoModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<ProductoModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  getByMarca(mar_id: number) {
    return this.http
      .get<ApiResponse<ProductoModel[]>>(`${this.baseUrl}/marca/${mar_id}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getByCategoria(cat_id: number) {
    return this.http
      .get<ApiResponse<ProductoModel[]>>(`${this.baseUrl}/categoria/${cat_id}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  create(producto: Omit<ProductoModel, 'prd_id' | 'prd_fec_cre'>) {
    return this.http
      .post<ApiResponse<ProductoModel>>(this.baseUrl, producto)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  update(id: number, producto: Partial<ProductoModel>) {
    return this.http
      .put<ApiResponse<ProductoModel>>(`${this.baseUrl}/${id}`, producto)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  remove(id: number) {
    return this.http
      .delete<ApiResponse<ProductoModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }
}