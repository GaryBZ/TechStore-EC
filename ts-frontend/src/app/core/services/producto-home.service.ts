import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ProductoHomeModel } from '../models/producto-home.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class ProductoHomeService {
  private readonly baseUrl = `${environment.apiUrl}/productos-home`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getMasVendidos(limit = 4) {
    return this.http
      .get<ApiResponse<ProductoHomeModel[]>>(`${this.baseUrl}/mas-vendidos?limit=${limit}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getRecientes(limit = 4) {
    return this.http
      .get<ApiResponse<ProductoHomeModel[]>>(`${this.baseUrl}/recientes?limit=${limit}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }
}