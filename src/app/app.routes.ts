import { Routes } from '@angular/router';
import { authGuard } from './gaurds/auth.guard';

export const routes: Routes = [
    { path : '', loadComponent : () => import('./components/login/login.component').then(c => c.LoginComponent) },
    { path : 'login', loadComponent : () => import('./components/login/login.component').then(c => c.LoginComponent) },
    { path : 'dashboard', loadComponent : () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent), canActivate: [authGuard] },
    // { path : 'clients', loadComponent : () => import('./components/client/cl').then(c => c.DashboardComponent), canActivate: [authGuard] },
    { path : 'profile', loadComponent : () => import('./components/profile/profile.component').then(c => c.ProfileComponent), canActivate: [authGuard] },
];
