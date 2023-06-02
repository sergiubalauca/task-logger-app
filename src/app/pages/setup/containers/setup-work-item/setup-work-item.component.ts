import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkItemRepository } from '@database';
import { IonicModule } from '@ionic/angular';
import { ModalService, WorkItem } from '@shared';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AddEditWorkItemComponent } from './add-edit-work-item/add-edit-work-item.component';

@Component({
    selector: 'app-setup-work-item',
    templateUrl: './setup-work-item.component.html',
    styleUrls: ['./setup-work-item.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule, CommonModule],
    providers: [WorkItemRepository, ModalService],
})
export class SetupWorkItemComponent implements OnInit {
    public workItems$: Observable<WorkItem[]>;

    constructor(
        private readonly workItemRepository: WorkItemRepository,
        private readonly modalService: ModalService
    ) {}

    ngOnInit() {
        this.workItems$ = this.workItemRepository.getAll$();
    }

    public async addWorkItem(): Promise<void> {
        await this.modalService.createAndShow(
            AddEditWorkItemComponent,
            '',
            {},
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        console.log('GSB modal data: ', modalData);

        if (modalData.data && modalData.data.dismissed) {
            this.workItemRepository.addWorkItem(modalData.data.workItem);
        }
    }

    public deleteWorkItem(workItem: WorkItem): void {
        this.workItemRepository.deleteWorkItem(workItem);
    }

    public async editWorkItem(workItem: WorkItem): Promise<void> {
        await this.modalService.createAndShow(
            AddEditWorkItemComponent,
            '',
            {
                workItem,
            },
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        if (modalData.data && modalData.data.dismissed) {
            const workItemToEdit: WorkItem = {
                ...modalData.data.workItem,
                id: workItem.id,
            };
            this.workItemRepository.editWorkItem(workItemToEdit);
        }
    }
}
