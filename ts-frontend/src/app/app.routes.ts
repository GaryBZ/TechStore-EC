import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Componentes } from './pages/products/componentes/componentes';
import { Perifericos } from './pages/products/perifericos/perifericos';
import { Monitores } from './pages/products/monitores/monitores';
import { Laptops } from './pages/products/laptops/laptops';
import { DetailProduct } from './pages/products/detail-product/detail-product';
import { Authentication } from './pages/auth/authentication/authentication';

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
    path: 'productos/:id',
    component: DetailProduct,
  },
  {
    path: 'authentication',
    component: Authentication,
  },
  {
    path: 'admin',
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
        path: 'pedidos',
        loadComponent: () => import('./admin/pages/pedidos/pedidos').then((m) => m.Pedidos),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./admin/pages/producto/listar-producto/listar-producto').then(
            (m) => m.ListarProducto,
          ),
      },
      {
        path: 'crear-producto',
        loadComponent: () =>
          import('./admin/pages/producto/crear-producto/crear-producto').then(
            (m) => m.CrearProducto,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
