import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'log-work',
        loadChildren: async () => {
            const logWorkModule = await import('../log-work/log-work.module');
            return logWorkModule.LogWorkModule;
        },
    },
    {
        path: 'setup',
        loadChildren: async () => {
            const setupModule = await import('../setup/setup.module');
            return setupModule.SetupModule;
        },
    },
    {
        path: 'playground',
        loadChildren: async () => {
            const playgroundModule = await import(
                '../playground/playground.module'
            );
            return playgroundModule.PlaygroundModule;
        },
    },
    {
        path: 'reports',
        loadChildren: async () => {
            const reportsModule = await import('../reports/reports.module');
            return reportsModule.ReportsModule;
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomePageRoutingModule {}
