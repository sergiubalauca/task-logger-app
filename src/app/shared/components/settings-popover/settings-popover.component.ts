import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { NgIf, NgStyle } from '@angular/common';
import { Browser } from '@capacitor/browser';

@Component({
    selector: 'app-settings-popover',
    templateUrl: './settings-popover.component.html',
    styleUrls: ['./settings-popover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf, NgStyle],
    providers: [],
})
export class SettingsPopoverComponent {
    public constructor(private popoverController: PopoverController) {}
    public logout(): void {
        this.popoverController.dismiss({
            logout: true,
        });
    }

    protected async openTermsAndConditions(): Promise<void> {
        await Browser.open({ url: 'https://sergiubalauca.github.io/dentalog-t-c/' });
    }

    protected deleteAccount(): void {
        this.popoverController.dismiss({
            deleteAccount: true,
        });
    }
}
