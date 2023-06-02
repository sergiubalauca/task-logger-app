import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxWorkItemDocumentType } from '../schemas/work-item.schema';

@Injectable()
export class WorkItemRepository {
    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

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

    public async deleteWorkItem(workItem: any) {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToDelete: any = await docCollection
                .findOne()
                .where('id')
                .eq(workItem.id)
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
