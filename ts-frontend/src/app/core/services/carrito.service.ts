import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { CarritoConDetalleModel, CarritoItemModel } from '../models/carrito-item.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly baseUrl = `${environment.apiUrl}/carrito-detalle`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getCarrito(usu_id: number) {
    return this.http
      .get<ApiResponse<CarritoConDetalleModel>>(`${this.baseUrl}/usuario/${usu_id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  agregarProducto(usu_id: number, prd_id: number, dca_can: number) {
    return this.http
      .post<ApiResponse<CarritoItemModel>>(`${this.baseUrl}/agregar`, { usu_id, prd_id, dca_can })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  actualizarCantidad(dca_id: number, dca_can: number) {
    return this.http
      .put<ApiResponse<CarritoItemModel>>(`${this.baseUrl}/item/${dca_id}`, { dca_can })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  eliminarItem(dca_id: number) {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/item/${dca_id}`);
  }
}