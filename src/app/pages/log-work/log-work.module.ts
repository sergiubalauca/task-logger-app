import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DateTimeService, ModalService, PlatformProvider } from '@shared';
import { LogWorkRoutingModule } from './log-work-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormReducer } from './form/custom-state/reducer/form.reducer';
import { FormSelector } from './form/custom-state/selector/form.selector';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        LogWorkRoutingModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    providers: [
        PlatformProvider,
        ModalService,
        DateTimeService,
        FormReducer,
        FormSelector,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogWorkModule {}
