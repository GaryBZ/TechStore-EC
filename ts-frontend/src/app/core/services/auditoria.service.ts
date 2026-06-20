import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { AuditoriaModel } from '../models/auditoria.model';

type ApiResponse<T> = { ok: boolean; data: T } | T;

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly baseUrl = `${environment.apiUrl}/auditoria`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  getAll() {
    return this.http
      .get<ApiResponse<AuditoriaModel[]>>(this.baseUrl)
      .pipe(map((response) => this.unwrapResponse(response) ?? []));
  }

  getById(id: number) {
    return this.http
      .get<ApiResponse<AuditoriaModel>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => this.unwrapResponse(response)));
  }
}