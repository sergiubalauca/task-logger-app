import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-settings-popover',
    templateUrl: './settings-popover.component.html',
    styleUrls: ['./settings-popover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf],
})
export class SettingsPopoverComponent {
    public constructor(private popoverController: PopoverController) {}

    public logout(): void {
        this.popoverController.dismiss({
            logout: true
        });
    }
}
