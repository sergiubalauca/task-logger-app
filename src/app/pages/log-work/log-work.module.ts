import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DateTimeService, ModalService, PlatformProvider } from '@shared';
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
import { WorkItemComponent } from './form/containers/work-item/work-item.component';
import { FormReducer } from './form/custom-state/reducer/form.reducer';
import { FormSelector } from './form/custom-state/selector/form.selector';
import { TimeTrackingComponent } from './form/containers/time-tracking/time-tracking.component';
import { TranslateErrorPipe } from './form/error-mappers';
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
        FormSwipeStateService,
        FormReducer,
        FormSelector,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogWorkModule {}
