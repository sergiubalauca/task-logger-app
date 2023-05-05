import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
    DateTimeService,
    ModalService,
    PlatformProvider,
    SharedModule,
} from '@shared';
import { LogWorkComponent } from './log-work.component';
import { LogWorkRoutingModule } from './log-work-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearcheableSelectInputComponent } from './form/components/searcheable-select-input/searcheable-select-input.component';
import { SearcheableSelectComponent } from './form/components/searcheable-select';
import { DatePickerComponent } from './form/components/date-picker/date-picker.component';
import { DatePickerModalComponent } from './form/components/date-picker-modal';
import { SwiperComponent } from './swiper/swiper.component';
import { DoctorComponent, PacientComponent } from './form/containers';
import { FormSwipeStateService } from './form/services';
@NgModule({
    declarations: [
        LogWorkComponent,
        SearcheableSelectInputComponent,
        SearcheableSelectComponent,
        DatePickerComponent,
        DatePickerModalComponent,
        SwiperComponent,
        DoctorComponent,
        PacientComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        LogWorkRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    providers: [PlatformProvider, ModalService, DateTimeService, FormSwipeStateService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogWorkModule {}
