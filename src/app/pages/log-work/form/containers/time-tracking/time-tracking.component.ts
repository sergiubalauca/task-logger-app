import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    inject,
} from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    AddButtonComponent,
    ItemSlidingCardComponent,
    LongPressDirective,
    SuppressTouchMoveDirective,
} from '@shared';
import { Observable, of } from 'rxjs';
import { MultiStepFormService } from '../../services';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { SearcheableSelectInputComponent } from '../../components/searcheable-select-input/searcheable-select-input.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { FormReducer } from '../../custom-state/reducer/form.reducer';

@Component({
    selector: 'app-time-tracking',
    templateUrl: './time-tracking.component.html',
    styleUrls: ['./time-tracking.component.scss'],
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
        ItemSlidingCardComponent,
        SuppressTouchMoveDirective,
        AddButtonComponent,
    ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
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

    private cdr = inject(ChangeDetectorRef);

    constructor(private multiStepFormService: MultiStepFormService) {
        setInterval(() => {
            this.cdr.markForCheck();
        }, 1000);
    }

    public addBreak(): void {
        this.multiStepFormService.addBreak();
    }

    public deleteBreak(id: number): void {
        this.multiStepFormService.deleteBreak(id);
    }

    public onLongPress(): void {
        console.log('long press');
    }

    public onTap(): void {
        console.log('tap');
    }
}
