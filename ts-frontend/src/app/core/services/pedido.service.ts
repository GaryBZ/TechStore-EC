import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { PedidoModel } from '../models/pedido.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly baseUrl = `${environment.apiUrl}/pedido`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<PedidoModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<PedidoModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  updateEstado(id: number, epd_id: number, usu_id_actor: number) {
    return this.http
      .put<ApiResponse<PedidoModel>>(`${this.baseUrl}/${id}/estado`, { epd_id, usu_id_actor })
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  cancelar(id: number, usu_id_actor: number) {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/${id}`, {
      body: { usu_id_actor },
    });
  }
}