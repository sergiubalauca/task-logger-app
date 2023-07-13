import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ModalService, DateTimeService } from '@shared';
import { PickerOptions } from '@ionic/core';
import {
    ControlValueAccessor,
    FormGroup,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
// import { format, formatISO } from 'date-fns';
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import { DatePickerModalComponent } from '../date-picker-modal';
import {
    DatePickerPresentationTypeEnum,
    DatePickerRoleTypeEnum,
} from '../../models';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [IonicModule],
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
    @Input() public form: FormGroup;
    @Input() chosenDate: string;
    @Input() label: string;

    public dateDisplayFormat: string;
    public customPickerOptions: Partial<PickerOptions>;
    public showDatetimePicker = true;
    public displayDate: string;

    public constructor(
        private modalService: ModalService,
        private dateTimeService: DateTimeService
    ) {}

    public writeValue(dateValue: any): void {
        if (dateValue) {
            this.displayDate = dateValue;
            // this.displayDate = format(
            //     new Date(dateValue),
            //     this.dateDisplayFormat
            // );
        }
    }
    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    public registerOnTouched(fn: any): void {}
    public setDisabledState?(isDisabled: boolean): void {}

    public ngOnInit() {
        this.dateDisplayFormat = 'HH:mm';
    }

    public async openModal() {
        try {
            const transformedDatethis = new Date(this.chosenDate);
            if (this.displayDate) {
                transformedDatethis.setHours(
                    Number(this.displayDate.split(':')[0]),
                    Number(this.displayDate.split(':')[1])
                );
            }

            const formattedDate = this.displayDate
                ? formatISO(new Date(transformedDatethis))
                : formatISO(this.dateTimeService.getCurrentDateTime());
            await this.modalService.createAndShow(
                DatePickerModalComponent,
                'datetime-picker',
                {
                    date: formattedDate,
                    presentationType: DatePickerPresentationTypeEnum.Time,
                },
                true
            );

            const response = await this.modalService.onDidDismiss();

            if (response.role === DatePickerRoleTypeEnum.Cancel) {
                this.displayDate = null;
            }

            if (
                response.role === DatePickerRoleTypeEnum.Save &&
                response.data !== undefined
            ) {
                // this.displayDate = format(
                //     new Date(response.data.date),
                //     this.dateDisplayFormat
                // );

                // transform date to time format (hh:mm)
                this.displayDate = format(
                    new Date(response.data.date),
                    'HH:mm'
                );
            }

            this.propagateChange(this.displayDate);
        } catch (error) {
            throw new Error(error);
        }
    }

    private propagateChange = (_: any) => {};
}
