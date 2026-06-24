import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';

type ApiResponse<T> = { ok: boolean; data: T } | T;

interface UploadResponse {
  url: string;
  public_id: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly baseUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  private unwrapResponse<T>(response: ApiResponse<T>): T | null {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as { data?: T }).data ?? null;
    }
    return response ?? null;
  }

  uploadProducto(file: File) {
    const formData = new FormData();
    formData.append('imagen', file);

    return this.http
      .post<ApiResponse<UploadResponse>>(`${this.baseUrl}/producto`, formData)
      .pipe(map((response) => this.unwrapResponse(response)));
  }
}