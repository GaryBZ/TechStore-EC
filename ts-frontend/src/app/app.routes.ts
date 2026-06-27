import { ListarProveedor } from './admin/pages/proveedores/listar-proveedor/listar-proveedor';
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Componentes } from './pages/products/componentes/componentes';
import { Perifericos } from './pages/products/perifericos/perifericos';
import { Monitores } from './pages/products/monitores/monitores';
import { Laptops } from './pages/products/laptops/laptops';
import { Authentication } from './pages/auth/authentication/authentication';
import { roleGuard } from './core/guards/role.guard';
import { ListarProducto } from './admin/pages/producto/listar-producto/listar-producto';
import { ListarProducts } from './pages/products/listar-products/listar-products';
import { MetodosPago } from './pages/perfil/metodos-pago/metodos-pago';
import { MiPerfil } from './pages/perfil/mi-perfil/mi-perfil';
import { CarritoCheckout } from './pages/carrito-checkout/carrito-checkout';
import { MisPedidos } from './pages/mis-pedidos/mis-pedidos';
import { MovimientosInventario } from './admin/pages/movimientos-inventario/movimientos-inventario';

export const routes: Routes = [
  {
    path: 'inicio',
    component: Home,
  },
  {
    path: 'categoria/componentes',
    component: Componentes,
  },
  {
    path: 'categoria/perifericos',
    component: Perifericos,
  },
  {
    path: 'categoria/monitores',
    component: Monitores,
  },
  {
    path: 'categoria/laptops',
    component: Laptops,
  },
  {
    path: 'authentication',
    component: Authentication,
  },
  {
    path: 'productos/buscar',
    component: ListarProducts,
  },
  {
    path: 'metodos-pago',
    component: MetodosPago,
  },
  {
    path: 'perfil',
    component: MiPerfil,
  },
  {
    path: 'checkout',
    component: CarritoCheckout,
  },
  {
    path: 'mis-pedidos',
    component: MisPedidos,
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['administrador'])],
    loadComponent: () =>
      import('./admin/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'marcas',
        loadComponent: () => import('./admin/pages/marca/marca').then((m) => m.Marca),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./admin/pages/categoria/categoria').then((m) => m.Categoria),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./admin/pages/inventario/inventario').then((m) => m.Inventario),
      },
      {
        path: 'auditoria',
        loadComponent: () => import('./admin/pages/auditoria/auditoria').then((m) => m.Auditoria),
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./admin/pages/proveedores/listar-proveedor/listar-proveedor').then(
            (m) => m.ListarProveedor,
          ),
      },
      {
        path: 'proveedores/crear',
        loadComponent: () =>
          import('./admin/pages/proveedores/crear-proveedor/crear-proveedor').then(
            (m) => m.CrearProveedor,
          ),
      },
      {
        path: 'proveedores/:id',
        loadComponent: () =>
          import('./admin/pages/proveedores/crear-proveedor/crear-proveedor').then(
            (m) => m.CrearProveedor,
          ),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./admin/pages/pedidos/pedidos').then((m) => m.Pedidos),
      },
      {
        path: 'movimientos-inventario',
        component: MovimientosInventario,
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./admin/pages/producto/listar-producto/listar-producto').then(
            (m) => m.ListarProducto,
          ),
      },
      {
        path: 'productos/crear',
        loadComponent: () =>
          import('./admin/pages/producto/crear-producto/crear-producto').then(
            (m) => m.CrearProducto,
          ),
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./admin/pages/producto/crear-producto/crear-producto').then(
            (m) => m.CrearProducto,
          ),
      },
    ],
  },

  {
    path: 'bodega',
    canActivate: [roleGuard(['administrador', 'bodeguero'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'productos', component: ListarProducto },
      { path: 'proveedores', component: ListarProveedor },
    ],
  },

  { path: '**', redirectTo: 'inicio' },
];
