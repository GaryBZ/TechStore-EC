import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { TarjetaModel } from '../models/tarjeta.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

interface NuevaTarjetaPayload {
  usu_id: number;
  mpg_id: number;
  tar_alias: string | null;
  tar_ult4: string;
  tar_marca: string;
  tar_titu: string;
  tar_venc: string;
}

@Injectable({ providedIn: 'root' })
export class TarjetaService {
  private readonly baseUrl = `${environment.apiUrl}/tarjetas`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getByUsuario(usu_id: number) {
    return this.http
      .get<ApiResponse<TarjetaModel[]>>(`${this.baseUrl}/usuario/${usu_id}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  create(payload: NuevaTarjetaPayload) {
    return this.http
      .post<ApiResponse<TarjetaModel>>(this.baseUrl, payload)
      .pipe(map((response) => this.unwrapResponse(response)));
  }

  delete(tar_id: number, usu_id: number) {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/${tar_id}`, {
      body: { usu_id },
    });
  }
}