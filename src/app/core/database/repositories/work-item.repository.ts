import { Injectable, inject } from '@angular/core';
import { CRUDParams, WorkItem } from '@shared';
import { DeepReadonlyObject, RxDocument } from 'rxdb';
import { Observable } from 'rxjs';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxWorkItemDocumentType } from '../schemas/work-item.schema';
import { LogWorkRepository } from './logwork.repository';

@Injectable()
export class WorkItemRepository {
    private readonly logWorkRepository = inject(LogWorkRepository);

    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public async getOne(
        params: Pick<CRUDParams, 'id'>
    ): Promise<DeepReadonlyObject<WorkItem>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToUpdate: WorkItem = await docCollection
                .findOne()
                .where('id')
                .eq(params.id)
                .exec();

            const res = workItemToUpdate as DeepReadonlyObject<WorkItem>;
            return res ?? null;
        }

        return null;
    }

    public async getOneByNameWithDifferentId(
        params: Pick<CRUDParams, 'name' | 'id'>
    ): Promise<DeepReadonlyObject<WorkItem>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.name) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToUpdate: WorkItem = await docCollection
                .findOne()
                .where('name')
                .eq(params.name)
                .where('id')
                .ne(params.id)
                .exec();

            const res = workItemToUpdate as DeepReadonlyObject<WorkItem>;
            return res ?? null;
        }

        return null;
    }

    public async getOneByName(
        params: Pick<CRUDParams, 'name'>
    ): Promise<DeepReadonlyObject<WorkItem>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.name) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToUpdate: WorkItem = await docCollection
                .findOne()
                .where('name')
                .eq(params.name)
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

    public async addOne(workItem: any): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        const alreadyExistingWorkItem = await this.getOneByName({
            name: workItem.name,
        });

        if (alreadyExistingWorkItem) {
            throw new Error('Work item already exists');
        }

        if (database && !alreadyExistingWorkItem) {
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

    public async deleteOne(params: Pick<CRUDParams, 'id'>) {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToDelete: any = await docCollection
                .findOne()
                .where('id')
                .eq(params.id.toString())
                .exec();

            if (workItemToDelete) {
                workItemToDelete.remove();
            }
        }
    }

    public async editOne(workItem: WorkItem): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        const alreadyExistingWorkItem = await this.getOneByNameWithDifferentId({
            name: workItem.name,
            id: workItem.id,
        });

        if (alreadyExistingWorkItem) {
            throw new Error('Work item already exists');
        }

        if (database && !alreadyExistingWorkItem) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemToUpdate: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(workItem.id)
                .exec();

            if (workItemToUpdate) {
                await this.logWorkRepository.updateLogWorksWithService(
                    workItemToUpdate.toJSON() as WorkItem,
                    workItem
                );

                await workItemToUpdate.incrementalPatch({
                    ...workItem,
                });
            }
        }
    }

    public async deleteAll(): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.workitem;
            const workItemsToDelete: RxDocument[] = await docCollection
                .find()
                .exec();

            if (workItemsToDelete && workItemsToDelete.length > 0) {
                for (const workItem of workItemsToDelete) {
                    await workItem.remove();
                }
            }
        }
    }
}
