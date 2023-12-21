import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
    {
        path: '',
        component: ReportsComponent,
    },
    // {
    //   path: 'doctors',
    //   component: SetupDoctorComponent,
    // },
    // {
    //   path: 'work-items',
    //   component: SetupWorkItemComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutingModule {}
