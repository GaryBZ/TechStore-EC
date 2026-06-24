import { Injectable, signal } from '@angular/core';
import { TarjetaModel } from '../models/tarjeta.model';

@Injectable({ providedIn: 'root' })
export class TarjetaService {
  private tarjetas = signal<TarjetaModel[]>([
    {
      tar_id: 1,
      mpg_id: 1,
      tar_alias: 'Tarjeta principal',
      tar_ult4: '4242',
      tar_marca: 'visa',
      tar_titu: 'Juan Perez',
      tar_venc: '08/27',
      tar_est: 'A',
    },
    {
      tar_id: 2,
      mpg_id: 1,
      tar_alias: 'Respaldo',
      tar_ult4: '4444',
      tar_marca: 'mastercard',
      tar_titu: 'Juan Perez',
      tar_venc: '03/26',
      tar_est: 'A',
    },
  ]);

  listar(): TarjetaModel[] {
    return this.tarjetas().filter((t) => t.tar_est === 'A');
  }

  agregar(tar: Omit<TarjetaModel, 'tar_id' | 'tar_est'>): void {
    const nextId = Math.max(0, ...this.tarjetas().map((t) => t.tar_id)) + 1;
    this.tarjetas.update((arr) => [...arr, { ...tar, tar_id: nextId, tar_est: 'A' }]);
  }

  eliminar(tar_id: number): void {
    this.tarjetas.update((arr) =>
      arr.map((t) => (t.tar_id === tar_id ? { ...t, tar_est: 'I' } : t)),
    );
  }
}