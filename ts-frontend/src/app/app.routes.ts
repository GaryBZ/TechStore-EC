import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Componentes } from './pages/products/componentes/componentes';
import { Perifericos } from './pages/products/perifericos/perifericos';
import { Monitores } from './pages/products/monitores/monitores';
import { Laptops } from './pages/products/laptops/laptops';
import { DetailProduct } from './pages/products/detail-product/detail-product';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'componentes', component: Componentes },
	{ path: 'perifericos', component: Perifericos },
	{ path: 'monitores', component: Monitores },
	{ path: 'laptops', component: Laptops },
	{ path: 'productos/:id', component: DetailProduct },
	{ path: 'login', component: Login },
	{ path: 'register', component: Register },
	{ path: '**', redirectTo: '' },
];
