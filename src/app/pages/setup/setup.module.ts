import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared';
import { SetupDoctorComponent } from './containers/setup-doctor/setup-doctor.component';
import { SetupWorkItemComponent } from './containers/setup-work-item/setup-work-item.component';
import { SetupRoutingModule } from './setup-routing.module';
import { SetupComponent } from './setup.component';

@NgModule({
    declarations: [
        SetupComponent,
        SetupWorkItemComponent,
        SetupDoctorComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        SetupRoutingModule,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SetupModule {}
