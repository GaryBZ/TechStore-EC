import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { CategoriaModel } from '../models/categoria.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly baseUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<CategoriaModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<CategoriaModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  create(categoria: Omit<CategoriaModel, 'cat_id'>) {
    return this.http
      .post<ApiResponse<CategoriaModel>>(this.baseUrl, categoria)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  update(id: number, categoria: Partial<CategoriaModel>) {
    return this.http
      .put<ApiResponse<CategoriaModel>>(`${this.baseUrl}/${id}`, categoria)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  remove(id: number) {
    return this.http
      .delete<ApiResponse<CategoriaModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }
}
