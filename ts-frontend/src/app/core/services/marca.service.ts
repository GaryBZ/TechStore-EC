import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { MarcaModel } from '../models/marca.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class MarcaService {
  private readonly baseUrl = `${environment.apiUrl}/marcas`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<MarcaModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<MarcaModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  create(marca: Omit<MarcaModel, 'mar_id'>) {
    return this.http
      .post<ApiResponse<MarcaModel>>(this.baseUrl, marca)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  update(id: number, marca: Partial<MarcaModel>) {
    return this.http
      .put<ApiResponse<MarcaModel>>(`${this.baseUrl}/${id}`, marca)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  remove(id: number) {
    return this.http
      .delete<ApiResponse<MarcaModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }
}