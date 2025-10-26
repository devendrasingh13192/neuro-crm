import { Routes } from '@angular/router';
import { authGuard } from './gaurds/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent), canActivate: [authGuard] },
  // { path : 'clients', loadComponent : () => import('./components/client/cl').then(c => c.DashboardComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent), canActivate: [authGuard] },
  {
    path: 'clients',
    loadComponent: () => import('./components/client-list/client-list.component').then(m => m.ClientListComponent),
    canActivate: [authGuard]
  },
  {
  path: 'clients/new',
  loadComponent: () => import('./components/client-form/client-form.component').then(m => m.ClientFormComponent),
  canActivate: [authGuard]
},
{
  path: 'clients/:id',
  loadComponent: () => import('./components/client-detail/client-detail.component').then(m => m.ClientDetailComponent),
  canActivate: [authGuard]
},
{
  path: 'clients/:id/edit',
  loadComponent: () => import('./components/client-form/client-form.component').then(m => m.ClientFormComponent),
  canActivate: [authGuard]
}
];
