import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkItemRepository } from 'src/app/core/database';
import { IonicModule } from '@ionic/angular';
import { ItemSlidingCardComponent, ItemSlidingProps, ModalService, WorkItem } from '@shared';
import { map, Observable } from 'rxjs';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AddEditWorkItemComponent } from './add-edit-work-item/add-edit-work-item.component';

@Component({
    selector: 'app-setup-work-item',
    templateUrl: './setup-work-item.component.html',
    styleUrls: ['./setup-work-item.component.scss'],
    standalone: true,
    imports: [
        HeaderComponent,
        IonicModule,
        CommonModule,
        ItemSlidingCardComponent,
    ],
    providers: [WorkItemRepository, ModalService],
})
export class SetupWorkItemComponent implements OnInit {
    public workItems$: Observable<ItemSlidingProps[]>;

    constructor(
        private readonly workItemRepository: WorkItemRepository,
        private readonly modalService: ModalService
    ) {}

    ngOnInit() {
        this.workItems$ = this.workItemRepository.getAll$().pipe(
            map((workItems: WorkItem[]) =>
                workItems.map((workItem: WorkItem) => {
                    const itemSlidingProp: ItemSlidingProps = {
                        id: Number(workItem.id),
                        title: workItem.name,
                        rows: [
                            `Description: ${workItem.description}`,
                            `Rate: ${workItem.price}`,
                        ],
                    };
                    return itemSlidingProp;
                })
            )
        );
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

    public async deleteWorkItem(workItemId: number): Promise<void> {
        await this.workItemRepository.deleteWorkItem(workItemId);
    }

    public async editWorkItem(workItemId: number): Promise<void> {
        const workItem = await this.workItemRepository.getOne$(workItemId);
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
