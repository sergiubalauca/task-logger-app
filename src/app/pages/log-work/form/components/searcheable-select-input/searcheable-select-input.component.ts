import {
    Component,
    Input,
    forwardRef,
    HostListener,
    Inject,
    ChangeDetectorRef,
    Output,
    EventEmitter,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormGroup,
} from '@angular/forms';
import { SearcheableSelectComponent } from '../searcheable-select/searcheable-select.component';
// import { SearcheableSelectModel } from '../searcheable-select/searcheable-select.model';
import { DOCUMENT } from '@angular/common';
import { PlatformName, PlatformProvider, SearcheableSelectModel } from '@shared';

@Component({
    selector: 'app-search-select-input',
    templateUrl: './searcheable-select-input.component.html',
    styleUrls: ['./searcheable-select-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearcheableSelectInputComponent),
            multi: true,
        },
    ],
})
export class SearcheableSelectInputComponent implements ControlValueAccessor {
    @Input() public form: FormGroup;
    @Output() public itemSelected: EventEmitter<SearcheableSelectModel> = new EventEmitter();
    public selectedValue: string | null;

    public constructor(
        private modalCtrl: ModalController,
        private platformProvider: PlatformProvider,
        @Inject(DOCUMENT) private document: Document,
        private cdr: ChangeDetectorRef
    ) {}

    @HostListener('window:resize', ['$event'])
    public getScreenSize(): number {
        return window.innerHeight;
    }

    public writeValue(value: string): void {
        this.selectedValue = value;
        // this.cdr.markForCheck();
    }
    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    public registerOnTouched(fn: any): void {}

    public setDisabledState?(isDisabled: boolean): void {}

    public async onOpenSelect(): Promise<void> {
        const selectOptions: SearcheableSelectModel[] = [
            {
                description: 'Un medic pretentios',
                id: '1',
                displayBoth: true,
                isSelected: false,
                value: 'Scarlatescu',
            },
            {
                description: 'Medic nou',
                id: '2',
                displayBoth: true,
                isSelected: false,
                value: 'Bordea',
            },
        ];
        const maxBreakpoint = this.getMaxBreakpoint();

        const modal = await this.modalCtrl.create({
            component: SearcheableSelectComponent,
            cssClass: 'custom-searcheable-select',
            backdropDismiss: true,
            // breakpoints: [0, 0.5, maxBreakpoint],
            initialBreakpoint: 0.8, //maxBreakpoint,
            componentProps: {
                selectOptions,
                selectedItemId: selectOptions.find(
                    (item) => item.value === this.selectedValue
                )?.id,
                controlLabel: 'Medic',
            },
            showBackdrop: false,
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.selectedValue = data.value;
            this.propagateChange(data);
            this.itemSelected.emit(data);
        }
    }

    private propagateChange = (_: any) => {};

    private getMaxBreakpoint(): number {
        const docHeaderHeight =
            this.document.getElementById('app-header')?.clientHeight;

        const headerHeight = docHeaderHeight ? docHeaderHeight : 64;
        const notchHeight: number =
            this.platformProvider.getPlatform() === PlatformName.IOS ? 48 : 0;
        const headerArea =
            docHeaderHeight > 64 ? headerHeight - notchHeight : headerHeight;

        return 1 - headerArea / (this.getScreenSize() / 100) / 100 + 0.01;
    }
}
