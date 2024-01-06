import {
    Component,
    Input,
    forwardRef,
    HostListener,
    Inject,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormGroup,
    FormsModule,
} from '@angular/forms';
import { SearcheableSelectComponent } from '../searcheable-select/searcheable-select.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
    CollectionNames,
    DOCTOR_COLLECTION_NAME,
    PlatformName,
    PlatformProvider,
    SearcheableSelectModel,
    WORK_ITEM_COLLECTION_NAME,
} from '@shared';

import { DoctorFacade, WorkItemFacade } from '@abstraction';

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
    standalone: true,
    imports: [IonicModule, FormsModule, CommonModule],
})
export class SearcheableSelectInputComponent
    implements ControlValueAccessor, OnDestroy
{
    @Input() public form: FormGroup;
    @Input() public strategy: CollectionNames;
    @Output() public itemSelected: EventEmitter<SearcheableSelectModel> =
        new EventEmitter();

    public inputLabel = {
        [DOCTOR_COLLECTION_NAME]: 'Doctor',
        [WORK_ITEM_COLLECTION_NAME]: 'Work Item',
    };

    public selectedValue: string | null;
    private dropdownDataStrategies = {
        [DOCTOR_COLLECTION_NAME]: this.doctorFacade,
        [WORK_ITEM_COLLECTION_NAME]: this.workItemFacade,
    };
    private dataSourceSubscription: Subscription;

    public constructor(
        private modalCtrl: ModalController,
        private platformProvider: PlatformProvider,
        @Inject(DOCUMENT) private document: Document,
        private doctorFacade: DoctorFacade,
        private workItemFacade: WorkItemFacade
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
    public ngOnDestroy(): void {
        if (this.dataSourceSubscription) {
            this.dataSourceSubscription.unsubscribe();
        }
    }
    public async onOpenSelect(): Promise<void> {
        if (this.dataSourceSubscription) {
            this.dataSourceSubscription.unsubscribe();
        }
        const strategy = this.dropdownDataStrategies[this.strategy];
        this.dataSourceSubscription = strategy
            .getAll$()
            .subscribe(async (items: any[]) => {
                const selectOptions: SearcheableSelectModel[] = items.map(
                    (item: { id: string; name: string; description: string }) =>
                        new SearcheableSelectModel({
                            id: item.id,
                            value: item.name,
                            description: item.description ?? '',
                            displayBoth: true,
                        })
                );

                const maxBreakpoint = this.getMaxBreakpoint();

                const modal = await this.modalCtrl.create({
                    component: SearcheableSelectComponent,
                    cssClass: 'custom-searcheable-select',
                    backdropDismiss: true,
                    breakpoints: [0, 0.5, 0.9],
                    initialBreakpoint: 0.9, //maxBreakpoint,
                    componentProps: {
                        selectOptions,
                        selectedItemId: selectOptions.find(
                            (item) => item.value === this.selectedValue
                        )?.id,
                        controlLabel: this.strategy,
                    },
                    showBackdrop: false,
                });
                await modal.present();
                const { data } = await modal.onWillDismiss();
                if (data) {
                    this.selectedValue = data.value;
                    this.propagateChange(data.value);
                    this.itemSelected.emit(data.value);
                }
            });
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
