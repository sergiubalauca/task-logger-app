import { RxDoctorDocumentType } from '@core';
import { CRUDParams } from '@shared';
import { DeepReadonlyObject } from 'rxdb';
import { Observable } from 'rxjs';

export interface RxDBStrategy {
    getOne?(params: Pick<CRUDParams, 'id'>): Promise<DeepReadonlyObject<any>>;
    getOne$?(
        params: Pick<CRUDParams, 'id'>
    ): Observable<DeepReadonlyObject<any>>;
    getAll$(): Observable<DeepReadonlyObject<any>[]>;
    addOne?(data: any): any;
    editOne?(data: any): any;
    deleteOne?(data: any): any;
    deleteAll?(): any;
}

export class Context {
    private strategy: RxDBStrategy;

    constructor(strategy: RxDBStrategy) {
        this.strategy = strategy;
    }

    public async getOne(
        params: Pick<CRUDParams, 'id'>
    ): Promise<DeepReadonlyObject<any>> {
        if (!params || !params.id) {
            throw new Error('ID is required');
        }
        return await this.strategy.getOne(params);
    }

    public getOne$(
        params: Pick<CRUDParams, 'id'>
    ): Observable<DeepReadonlyObject<any>> {
        if (!params || !params.id) {
            throw new Error('ID is required');
        }
        return this.strategy.getOne$(params);
    }

    public getAll$(): Observable<DeepReadonlyObject<any>> {
        return this.strategy.getAll$();
    }

    public async addOne(data: any): Promise<void> {
        return await this.strategy.addOne(data);
    }

    public async editOne(data: any): Promise<void> {
        return await this.strategy.editOne(data);
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>): Promise<void> {
        return await this.strategy.deleteOne(params);
    }

    public async deleteAll(): Promise<void> {
        return await this.strategy.deleteAll();
    }
}
