import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
    FormCanDeactivateService,
    ItemSlidingCardComponent,
    ItemSlidingProps,
    ModalService,
    WorkItem,
} from '@shared';
import { firstValueFrom, map, Observable, take } from 'rxjs';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AddEditWorkItemComponent } from './add-edit-work-item/add-edit-work-item.component';
import { WorkItemApiServce, WorkItemFacade } from '@abstraction';

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
    providers: [ModalService, WorkItemApiServce],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupWorkItemComponent implements OnInit {
    public workItems$: Observable<ItemSlidingProps[]>;
    private formCanDeactivateService: FormCanDeactivateService = inject(
        FormCanDeactivateService
    );

    constructor(
        private readonly workItemFacade: WorkItemFacade,
        private readonly modalService: ModalService,
        private readonly workItemApiService: WorkItemApiServce
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
                            `Price: ${workItem.price}`,
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
            true,
            this.formCanDeactivateService.canDeactivateFn
        );

        const modalData = await this.modalService.onDidDismiss();

        if (modalData.data && modalData.data.dismissed) {
            const apiDoc = await firstValueFrom(
                this.workItemApiService
                    .createWorkItem(modalData.data.workItem)
                    .pipe(take(1))
            );

            this.workItemFacade.addOne({
                ...modalData.data.workItem,
                mongoId: apiDoc?._id ?? '',
            });
        }
    }

    public async deleteWorkItem(workItemId: number): Promise<void> {
        const rxdbWorkItem = await this.workItemFacade.getOne({
            id: workItemId.toString(),
        });
        await firstValueFrom(
            this.workItemApiService
                .deleteWorkItem(rxdbWorkItem.mongoId)
                .pipe(take(1))
        );
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
            true,
            this.formCanDeactivateService.canDeactivateFn
        );

        const modalData = await this.modalService.onDidDismiss();

        if (modalData.data && modalData.data.dismissed) {
            const workItemToEdit: WorkItem = {
                ...modalData.data.workItem,
                id: workItemId.toString(),
            };
            await this.workItemFacade.editOne(workItemToEdit);
            await firstValueFrom(
                this.workItemApiService
                    .updateWorkItem({ ...workItemToEdit, id: workItem.mongoId })
                    .pipe(take(1))
            );
        }
    }
}
