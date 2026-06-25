export interface CarritoItemModel {
  dca_id: number;
  car_id: number;
  prd_id: number;
  dca_can: number;
  dca_pre_uni: number;
  dca_sub: number;
  dca_est: string;
  prd_nom: string;
  prd_sku: string;
  pro_img: string | null;
  prd_pre_ven: number;
  prd_stk_min: number | null;
}

export interface CarritoModel {
  car_id: number;
  usu_id: number;
  car_est: string;
  car_fec_cre: string;
}

export interface CarritoConDetalleModel {
  carrito: CarritoModel;
  items: CarritoItemModel[];
}