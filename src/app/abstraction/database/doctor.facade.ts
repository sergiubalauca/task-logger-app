import { Injectable } from '@angular/core';
import { DoctorRepository } from '@core';
import { map, Observable } from 'rxjs';
import { RxDoctorDocumentType } from 'src/app/core/database/schemas';
import { Context, CRUDParams } from './strategy/rxdb-database.strategy';

@Injectable()
export class DoctorFacade {
    private readonly doctorStrategies = {
        rxdb: this.doctorRepository,
    };
    private readonly strategy = 'rxdb';
    private readonly context: Context;

    constructor(private readonly doctorRepository: DoctorRepository) {
        const strategy = this.doctorStrategies[this.strategy];
        if (!strategy) {
            throw new Error('Strategy not found');
        }
        this.context = new Context(strategy);
    }

    public async getOne(params: Pick<CRUDParams, 'id'>): Promise<any> {
        return await this.context.getOne(params);
    }

    public getAll$(): Observable<RxDoctorDocumentType[]> {
        return this.context
            .getAll$()
            .pipe(map((doctors) => doctors as RxDoctorDocumentType[]));
    }

    public async addOne(doctor: any): Promise<void> {
        return await this.context.addOne(doctor);
    }

    public async editOne(doctor: any): Promise<void> {
        return await this.context.editOne(doctor);
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>): Promise<void> {
        return await this.context.deleteOne(params);
    }
}
