import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
    selector: 'app-settings-popover',
    templateUrl: './settings-popover.component.html',
    styleUrls: ['./settings-popover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf],
    providers: [InAppBrowser],
})
export class SettingsPopoverComponent {
    public constructor(private popoverController: PopoverController) {}
    private inAppBrowser: InAppBrowser = inject(InAppBrowser);
    public logout(): void {
        this.popoverController.dismiss({
            logout: true,
        });
    }

    protected openTermsAndConditions(): void {
        const browser = this.inAppBrowser.create(
            'https://sergiubalauca.github.io/dentalog-t-c/',
            '_blank',
            'presentationstyle=formsheet,toolbarposition=top,fullscreen=no,hideurlbar=yes,toolbarcolor=#176bff,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff'
        );

        browser.show();
    }
}
