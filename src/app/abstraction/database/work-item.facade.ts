import { Injectable } from '@angular/core';
import { WorkItemRepository } from '@core';
import { WorkItem } from '@shared';
import { DeepReadonlyObject } from 'rxdb';
import { map, Observable } from 'rxjs';
import { RxWorkItemDocumentType } from 'src/app/core/database/schemas/work-item.schema';

import { Context, CRUDParams } from './strategy/rxdb-database.strategy';

@Injectable()
export class WorkItemFacade {
    private readonly workItemStrategies = {
        rxdb: this.workItemRepository,
    };
    private readonly returnTypeBasedOnStrategy = {
        rxdb: Promise<DeepReadonlyObject<WorkItem>>,
    };

    private readonly strategy = 'rxdb';
    private readonly context: Context;

    constructor(private readonly workItemRepository: WorkItemRepository) {
        const strategy = this.workItemStrategies[this.strategy];
        if (!strategy) {
            throw new Error('Strategy not found');
        }
        this.context = new Context(strategy);
    }

    public async getOne(params: Pick<CRUDParams, 'id'>): Promise<any> {
        return await this.context.getOne(params);
    }

    public getAll$(): Observable<RxWorkItemDocumentType[]> {
        return this.context
            .getAll$()
            .pipe(map((workItems) => workItems as RxWorkItemDocumentType[]));
    }

    public async addOne(workItem: any): Promise<void> {
        return await this.context.addOne(workItem);
    }

    public async editOne(workItem: any): Promise<void> {
        return await this.context.editOne(workItem);
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>): Promise<void> {
        return await this.context.deleteOne(params);
    }
}
