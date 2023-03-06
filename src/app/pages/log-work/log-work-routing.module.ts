import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogWorkComponent } from './log-work.component';

const routes: Routes = [
  {
    path: '',
    component: LogWorkComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogWorkRoutingModule {}
