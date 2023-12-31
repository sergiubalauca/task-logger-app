/* eslint-disable @typescript-eslint/member-ordering */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
} from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    DOCTOR_COLLECTION_NAME,
    LongPressDirective,
    SearcheableSelectModel,
} from '@shared';
import {
    BehaviorSubject,
    Observable,
    distinctUntilChanged,
    of,
    switchMap,
} from 'rxjs';
import { MultiStepFormService } from '../../services';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { SearcheableSelectInputComponent } from '../../components/searcheable-select-input/searcheable-select-input.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { FormReducer } from '../../custom-state/reducer/form.reducer';
import { FormSelector } from '../../custom-state/selector/form.selector';

@Component({
    selector: 'app-time-tracking',
    templateUrl: './time-tracking.component.html',
    styleUrls: ['./time-tracking.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgFor,
        SearcheableSelectInputComponent,
        DatePickerComponent,
        AsyncPipe,
        CommonModule,
        LongPressDirective,
    ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeTrackingComponent {
    @Input() public chosenDate: string;
    public doctorGroupControls: Observable<{
        form: FormGroup;
        timeGroup?: FormGroup;
        timeGroupControls?: AbstractControl[];
    }> = of({
        form: this.multiStepFormService.getForm(),
        timeGroup: this.multiStepFormService.getTimeFormGroup(),
        timeGroupControls: this.multiStepFormService.getTimeFormGroupControls(),
    });

    public readonly strategy = DOCTOR_COLLECTION_NAME;
    private cdr = inject(ChangeDetectorRef);

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formStore: FormReducer
    ) {
        setInterval(() => {
            this.cdr.markForCheck();
        }, 1000);
    }

    public addBreak(): void {
        this.multiStepFormService.addBreak();
    }

    public onLongPress(): void {
        console.log('long press');
    }

    public onTap(): void {
        console.log('tap');
    }
}
