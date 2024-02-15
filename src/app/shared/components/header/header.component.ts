import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { NavController, IonicModule, PopoverController } from '@ionic/angular';
import { DOCUMENT, NgIf, NgStyle } from '@angular/common';
import { SettingsPopoverComponent } from '../settings-popover/settings-popover.component';
import { AuthFacade } from '@abstraction';
import { LogOutModel } from '../../models';
import { PlatformName, PlatformProvider } from '../../services';
import { AlertService } from '../../alert';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf, NgStyle],
    providers: [AuthFacade, PlatformProvider, AlertService],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() title: string;
    @Input() public headerSubtitle: string;
    @Input() public backBtnEnabled: boolean;
    @Input() public backBtnIconClose: boolean;
    @Input() public settingsEnabled = true;

    public constructor(
        private navController: NavController,
        public popoverController: PopoverController,
        private authFacade: AuthFacade,
        private platformProvider: PlatformProvider
    ) {}

    public ngOnInit(): void {}

    public async goBack(): Promise<void> {
        await this.navController.pop();
    }

    public async presentPopover(event: Event) {
        const popover = await this.popoverController.create({
            component: SettingsPopoverComponent,
            event,
        });

        await popover.present();

        const { data } = await popover.onDidDismiss();

        if (data?.logout) {
            const loggedInUser = localStorage.getItem('USER_EMAIL');
            const logOutModel: LogOutModel = {
                email: loggedInUser,
            };
            await this.authFacade.logoutWithConfirmation(logOutModel);
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(): number {
        return window.innerHeight;
    }

    protected getHeaderThreshold(): {
        'padding-top': string;
        'margin-top': string;
    } {
        return this.platformProvider.getPlatform() === PlatformName.IOS
            ? { 'padding-top': '54px', 'margin-top': '54px' }
            : { 'padding-top': '0', 'margin-top': '0' };
    }
    public ngOnDestroy(): void {}
}
