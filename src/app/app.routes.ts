import { Routes } from '@angular/router';
import { AuthenticationScreen } from './features/authentication/layout/authentication-screen/authentication-screen';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthenticationScreen,
        canActivate: [guestGuard],
        loadChildren: () => import('./core/routes/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        loadChildren: () => import('./core/routes/movies.routes').then((m) => m.MOVIES_ROUTES),
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
    }
];
