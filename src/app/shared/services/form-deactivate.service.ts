import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FormCanDeactivateService {
    constructor(private actionSheetCtrl: ActionSheetController) {
        this.canDeactivateSub$.next(true);
    }

    private canDeactivateSub$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(true);
    public canDeactivate = this.canDeactivateSub$.asObservable();

    public setCanDeactivate(canDeactivate: boolean): void {
        this.canDeactivateSub$.next(canDeactivate);
    }

    public getCanDeactivate(): boolean {
        return this.canDeactivateSub$.getValue();
    }

    public resetCanDeactivate(): void {
        this.canDeactivateSub$.next(true);
    }

    public ngOnDestroy(): void {
        this.canDeactivateSub$.complete();
    }

    public canDeactivateFn = async () => {
        const canDeactivate = this.getCanDeactivate();

        if (canDeactivate) {
            return true;
        }
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Discard changes?',
            backdropDismiss: false,
            animated: true,
            cssClass: 'action-sheet',
            mode: 'ios',
            translucent: true,
            keyboardClose: true,
            buttons: [
                {
                    text: 'Yes',
                    role: 'confirm',
                },
                {
                    text: 'No',
                    role: 'cancel',
                },
            ],
        });

        actionSheet.present();

        const { role } = await actionSheet.onWillDismiss();

        return role === 'confirm';
    };
}
