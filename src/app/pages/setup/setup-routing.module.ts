import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupDoctorComponent } from './containers/setup-doctor/setup-doctor.component';
import { SetupWorkItemComponent } from './containers/setup-work-item/setup-work-item.component';
import { SetupComponent } from './setup.component';


const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
  },
  {
    path: 'doctors',
    component: SetupDoctorComponent,
  },
  {
    path: 'work-items',
    component: SetupWorkItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
