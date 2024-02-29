import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import {
    Doctor,
    FormCanDeactivateService,
    HeaderComponent,
    ModalService,
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
import { map, Observable, of, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-add-edit-doctor',
    templateUrl: './add-edit-doctor.component.html',
    styleUrls: ['./add-edit-doctor.component.scss'],
    standalone: true,
    providers: [ModalService, ModalController],
    imports: [
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

    private readonly modalCtrl: ModalController = inject(ModalController);
    private readonly formCanDeactivateService: FormCanDeactivateService =
        inject(FormCanDeactivateService);
    private destroyRef = inject(DestroyRef);

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
