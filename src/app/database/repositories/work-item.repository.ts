import { Injectable } from '@angular/core';
import { WorkItem } from '@shared';
import { DeepReadonlyObject } from 'rxdb';
import { Observable } from 'rxjs';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxWorkItemDocumentType } from '../schemas/work-item.schema';

@Injectable()
export class WorkItemRepository {
    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public async getOne$(id: number): Promise<DeepReadonlyObject<WorkItem>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToUpdate: WorkItem = await docCollection
                .findOne()
                .where('id')
                .eq(id.toString())
                .exec();

            const res = workItemToUpdate as DeepReadonlyObject<WorkItem>;
            return res ?? null;
        }

        return null;
    }

    public getAll$(): Observable<RxWorkItemDocumentType[]> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            return database.workitem.find().$;
        }

        return null;
    }

    public async addWorkItem(workItem: any): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;

            // eslint-disable-next-line @typescript-eslint/dot-notation
            await docCollection.insert({
                ...workItem,
                // generate random id based on timestamp
                id: new Date().getTime().toString(),
            });
        }
    }

    public async deleteWorkItem(workItemId: number) {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToDelete: any = await docCollection
                .findOne()
                .where('id')
                .eq(workItemId.toString())
                .exec();

            if (workItemToDelete) {
                workItemToDelete.remove();
            }
        }
    }

    public async editWorkItem(workItem: any): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToUpdate: any = await docCollection
                .findOne()
                .where('id')
                .eq(workItem.id)
                .exec();

            if (workItemToUpdate) {
                await workItemToUpdate.incrementalPatch({
                    ...workItem,
                });
            }
        }
    }
}
