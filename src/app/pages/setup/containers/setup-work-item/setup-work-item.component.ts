import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
    ItemSlidingCardComponent,
    ItemSlidingProps,
    ModalService,
    WorkItem,
} from '@shared';
import { map, Observable } from 'rxjs';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AddEditWorkItemComponent } from './add-edit-work-item/add-edit-work-item.component';
import { WorkItemFacade } from '@abstraction';

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
    providers: [ModalService],
})
export class SetupWorkItemComponent implements OnInit {
    public workItems$: Observable<ItemSlidingProps[]>;

    constructor(
        private readonly workItemFacade: WorkItemFacade,
        private readonly modalService: ModalService
    ) {}

    ngOnInit() {
        this.workItems$ = this.workItemFacade.getAll$().pipe(
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
            this.workItemFacade.addOne(modalData.data.workItem);
        }
    }

    public async deleteWorkItem(workItemId: number): Promise<void> {
        await this.workItemFacade.deleteOne({ id: workItemId.toString() });
    }

    public async editWorkItem(workItemId: number): Promise<void> {
        const workItem = await this.workItemFacade.getOne({
            id: workItemId.toString(),
        });
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
            await this.workItemFacade.editOne(workItemToEdit);
        }
    }
}
