import {
    Component,
    DestroyRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import {
    FormCanDeactivateService,
    HeaderComponent,
    ModalService,
    ThrottleButtonDirective,
    TranslateErrorPipe,
    UppercaseDirective,
    WorkItem,
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
import { map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-add-edit-work-item',
    templateUrl: './add-edit-work-item.component.html',
    styleUrls: ['./add-edit-work-item.component.scss'],
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
    ]
})
export class AddEditWorkItemComponent implements OnInit {
    public workItemForm: FormGroup;
    @Input() private workItem: WorkItem;

    private destroyRef = inject(DestroyRef);
    private readonly formCanDeactivateService: FormCanDeactivateService =
        inject(FormCanDeactivateService);

    constructor(
        private readonly modalCtrl: ModalController,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.workItemForm = this.formBuilder.group({
            name: new FormControl(
                this.workItem ? this.workItem.name : '',
                Validators.required
            ),
            price: new FormControl(this.workItem ? this.workItem.price : '', [
                Validators.required,
                // validate price to be a positive number without any special characters
                Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
            ]),
            description: new FormControl(
                this.workItem ? this.workItem.description : ''
            ),
        });

        this.workItemForm.statusChanges
            .pipe(
                map((_status) => {
                    return this.workItemForm.pristine;
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
                workItem: this.workItemForm.value,
                dismissed: true,
            },
            'Save'
        );
    }

    public closeModal() {
        this.modalCtrl.dismiss();
    }
}
