import { IonDatetime, ModalController, IonicModule } from '@ionic/angular';
import { Component, Input, ViewChild } from '@angular/core';
import {
    DatePickerPresentationTypeEnum,
    DatePickerRoleTypeEnum,
} from '../../models';

@Component({
    selector: 'app-date-picker-modal',
    templateUrl: './date-picker-modal.component.html',
    styleUrls: ['./date-picker-modal.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class DatePickerModalComponent {
    @Input() public date: string;
    @Input() public presentationType: DatePickerPresentationTypeEnum;
    @ViewChild(IonDatetime) public datetime: IonDatetime;

    public constructor(private modalController: ModalController) {}

    public handleDate(e: any): void {
        this.date = e.detail.value;

        this.modalController.dismiss(
            {
                dismissed: true,
                date: this.date,
            },
            DatePickerRoleTypeEnum.Save
        );
    }

    public cancelModal(): void {
        this.modalController.dismiss(
            {
                dismissed: true,
                date: this.date,
            },
            DatePickerRoleTypeEnum.Cancel
        );
    }

    public confirm() {
        this.datetime.confirm(true);
    }
}
