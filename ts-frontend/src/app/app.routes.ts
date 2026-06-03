import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Componentes } from './pages/products/componentes/componentes';
import { Perifericos } from './pages/products/perifericos/perifericos';
import { Monitores } from './pages/products/monitores/monitores';
import { Laptops } from './pages/products/laptops/laptops';
import { DetailProduct } from './pages/products/detail-product/detail-product';
import { Authentication } from './pages/auth/authentication/authentication';

export const routes: Routes = [
	{ path: 'inicio', component: Home },
	{ path: 'categoria/componentes', component: Componentes },
	{ path: 'categoria/perifericos', component: Perifericos },
	{ path: 'categoria/monitores', component: Monitores },
	{ path: 'categoria/laptops', component: Laptops },
	{ path: 'productos/:id', component: DetailProduct },
	{ path: 'authentication', component: Authentication },
	{ path: '**', redirectTo: 'inicio' },
];
