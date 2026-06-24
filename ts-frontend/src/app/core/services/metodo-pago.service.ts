import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MetodoPagoModel } from '../models/metodo-pago.model';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class MetodoPagoService {
  private readonly base = `${environment.apiUrl}/metodos-pago`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MetodoPagoModel[]> {
    return this.http.get<MetodoPagoModel[]>(this.base);
  }
}