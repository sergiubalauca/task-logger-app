import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import {
    Country,
    countryListIcons,
    Doctor,
    FormCanDeactivateService,
    HeaderComponent,
    ModalService,
    PhoneNumberMaskService,
    ThrottleButtonDirective,
    TranslateErrorPipe,
    UppercaseDirective,
} from '@shared';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { BehaviorSubject, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { IonSelectCustomEvent, SelectChangeEventDetail } from '@ionic/core';

@Component({
    selector: 'app-add-edit-doctor',
    templateUrl: './add-edit-doctor.component.html',
    styleUrls: ['./add-edit-doctor.component.scss'],
    standalone: true,
    providers: [ModalService, ModalController, PhoneNumberMaskService],
    imports: [
        MaskitoDirective,
        IonicModule,
        CommonModule,
        HeaderComponent,
        FormsModule,
        ReactiveFormsModule,
        ThrottleButtonDirective,
        UppercaseDirective,
        TranslateErrorPipe,
    ],
})
export class AddEditDoctorComponent implements OnInit {
    public doctorForm: FormGroup;
    @Input() private doctor: Doctor;

    private readonly phoneMaskService: PhoneNumberMaskService = inject(
        PhoneNumberMaskService
    );
    private readonly modalCtrl: ModalController = inject(ModalController);
    private readonly formCanDeactivateService: FormCanDeactivateService =
        inject(FormCanDeactivateService);
    private destroyRef = inject(DestroyRef);

    private phoneMask$: BehaviorSubject<MaskitoOptions> = new BehaviorSubject(
        this.phoneMaskService.getMaskByCountryCode('RO')
    );
    public readonly phoneMaskObs$ = this.phoneMask$.asObservable();

    protected setPhoneMask(
        event: IonSelectCustomEvent<SelectChangeEventDetail<any>>
    ): void {
        const countryCode = event.detail.value;
        this.phoneMask$.next(
            this.phoneMaskService.getMaskByCountryCode(countryCode)
        );
    }
    protected readonly maskPredicate: MaskitoElementPredicate = async (el) =>
        (el as HTMLIonInputElement).getInputElement();

    protected selectedValue: Country = countryListIcons[0];

    protected readonly countryListIcons = countryListIcons;

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit(): void {
        this.doctorForm = this.formBuilder.group({
            name: new FormControl<string>(
                this.doctor ? this.doctor.name : '',
                Validators.required
            ),
            phone: new FormControl<string>(
                this.doctor ? this.doctor.phone : ''
            ),
        });

        this.doctorForm.statusChanges
            .pipe(
                map((_status) => {
                    return this.doctorForm.pristine;
                }),
                takeUntilDestroyed(this.destroyRef),
                startWith(true)
            )
            .subscribe((canDeactivate: boolean) => {
                this.formCanDeactivateService.setCanDeactivate(canDeactivate);
            });

        this.selectedValue = this.phoneMaskService.matchAndGetMaskByPhoneNumber(
            this.doctorForm.value.phone
        );
    }

    public async onSubmit(): Promise<boolean> {
        this.formCanDeactivateService.setCanDeactivate(true);
        return await this.modalCtrl.dismiss(
            {
                doctor: this.doctorForm.value,
                dismissed: true,
            },
            'Save'
        );
    }

    public async closeModal() {
        await this.modalCtrl.dismiss();
    }
}
