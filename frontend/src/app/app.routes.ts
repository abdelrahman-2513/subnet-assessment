import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'subnets',
      loadChildren: () => import('./features/subnet/subnet-module').then(m => m.SubnetModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ips',
    loadChildren: () => import('./features/ip/ip-module').then(m => m.IpModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'auth/login' }
];