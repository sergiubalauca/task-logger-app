import { Injectable } from '@angular/core';
import { LogWorkRepository, RxLogWorkDocumentType } from '@core';
import { CRUDParams, DailyWork } from '@shared';
import { map, Observable } from 'rxjs';
import { Context } from './strategy/rxdb-database.strategy';

@Injectable()
export class DailyWorkFacade {
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

    public async getOne(params: Pick<CRUDParams, 'id'>): Promise<any> {
        return await this.context.getOne(params);
    }

    public getAll$(): Observable<RxLogWorkDocumentType[]> {
        return this.context
            .getAll$()
            .pipe(map((logWorks) => logWorks as RxLogWorkDocumentType[]));
    }

    public async addOne(logWork: any): Promise<void> {
        return await this.context.addOne(logWork);
    }

    public async editOne(logWork: {
        dailyWork: DailyWork;
        dailyId: string;
        mongoId?: string;
    }): Promise<void> {
        return await this.context.editOne(logWork);
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>): Promise<void> {
        return await this.context.deleteOne(params);
    }

    public async deleteAll(): Promise<void> {
        return await this.context.deleteAll();
    }
}
