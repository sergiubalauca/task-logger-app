import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { MultiStepFormService } from '../../services';
import { addPatientControl } from '../actions/form.actions';

@Injectable()
export class FormEffects {
    public addPatientControl$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(addPatientControl),
                tap((action) => {
                    this.formService.addPatientControl(action.doctorIndex);
                })
            ),
        { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private formService: MultiStepFormService
    ) {}
}
