import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isLoggedIn } from './core/auth';
import { LogInPage } from './pages/login/log-in.page';
import { RegisterPage } from './pages/register/register.page';

const routes: Routes = [
    {
        path: 'playground',
        loadChildren: () =>
            import('./pages/playground/playground.module').then(
                (m) => m.PlaygroundModule
            ),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('./pages/home/home.module').then((m) => m.HomeModule),
        canActivate: [isLoggedIn],
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LogInPage,
    },
    {
        path: 'register',
        component: RegisterPage,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
