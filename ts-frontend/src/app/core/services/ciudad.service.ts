import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { CiudadModel } from '../models/ciudad.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class CiudadService {
  private readonly baseUrl = `${environment.apiUrl}/ciudades`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<CiudadModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getByProvincia(prv_id: number) {
    return this.http
      .get<ApiResponse<CiudadModel[]>>(`${this.baseUrl}/provincia/${prv_id}`)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }
}