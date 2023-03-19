import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DateTimeService, ModalService, PlatformProvider, SharedModule } from '@shared';
import { LogWorkComponent } from './log-work.component';
import { LogWorkRoutingModule } from './log-work-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearcheableSelectInputComponent } from './form/components/searcheable-select-input/searcheable-select-input.component';
import { SearcheableSelectComponent } from './form/components/searcheable-select';
import { FormModalComponent } from './form/form-modal/form-modal.component';
import { DatePickerComponent } from './form/components/date-picker/date-picker.component';
import { DatePickerModalComponent } from './form/components/date-picker-modal';

@NgModule({
    declarations: [
        LogWorkComponent,
        SearcheableSelectInputComponent,
        SearcheableSelectComponent,
        FormModalComponent,
        DatePickerComponent,
        DatePickerModalComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
        LogWorkRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    providers: [PlatformProvider, ModalService, DateTimeService],
})
export class LogWorkModule {}
