import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    HeaderComponent,
    ModalService,
    ThrottleButtonDirective,
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

@Component({
    selector: 'app-add-edit-work-item',
    templateUrl: './add-edit-work-item.component.html',
    styleUrls: ['./add-edit-work-item.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        HeaderComponent,
        FormsModule,
        ReactiveFormsModule,
        ThrottleButtonDirective,
    ],
    providers: [ModalService, ModalController],
})
export class AddEditWorkItemComponent implements OnInit {
    public workItemForm: FormGroup;
    @Input() private workItem: WorkItem;

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
            price: new FormControl(
                this.workItem ? this.workItem.price : '',
                Validators.required
            ),
            description: new FormControl(
                this.workItem ? this.workItem.description : ''
            ),
        });
    }

    public async onSubmit(): Promise<boolean> {
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
