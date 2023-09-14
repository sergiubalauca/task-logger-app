import { Injectable } from '@angular/core';
import { LogWorkRepository, RxLogWorkDocumentType } from '@core';
import { CRUDParams, DailyWork, DailyWorkDoc } from '@shared';
import { DeepReadonlyObject } from 'rxdb';
import { map, Observable } from 'rxjs';
import { Context } from './strategy/rxdb-database.strategy';

@Injectable()
export class LogWorkFacade {
    private readonly logWorkStrategies = {
        rxdb: this.logWorkRepository,
    };

    private readonly strategy = 'rxdb';
    private readonly context: Context;

    constructor(private readonly logWorkRepository: LogWorkRepository) {
        const strategy = this.logWorkStrategies[this.strategy];
        if (!strategy) {
            throw new Error('Strategy not found');
        }
        this.context = new Context(strategy);
    }

    public async getOne(params: Pick<CRUDParams, 'id'>): Promise<DeepReadonlyObject<DailyWorkDoc>> {
        return await this.context.getOne(params);
    }

    public getOne$(
        params: Pick<CRUDParams, 'id'>
    ): Observable<DeepReadonlyObject<DailyWorkDoc>> {
        return this.context.getOne$(params);
    }

    public getAll$(): Observable<RxLogWorkDocumentType[]> {
        return this.context
            .getAll$()
            .pipe(
                map((logWorkItems) => logWorkItems as RxLogWorkDocumentType[])
            );
    }

    public async addOne(logWorkItem: any): Promise<void> {
        return await this.context.addOne(logWorkItem);
    }

    public async editOne(logWorkItem: {
        dailyWork: DailyWork;
        dailyId: string;
        mongoId?: string;
    }): Promise<void> {
        return await this.context.editOne(logWorkItem);
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>): Promise<void> {
        return await this.context.deleteOne(params);
    }
}
