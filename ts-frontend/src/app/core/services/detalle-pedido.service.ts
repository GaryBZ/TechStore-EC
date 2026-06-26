import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { DetallePedidoModel } from '../models/detalle-pedido.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class DetallePedidoService {
  private readonly baseUrl = `${environment.apiUrl}/detalle-pedido`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getByPedido(ped_id: number) {
    return this.http
      .get<ApiResponse<DetallePedidoModel[]>>(`${this.baseUrl}/pedido/${ped_id}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }
}