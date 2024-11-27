import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    input,
} from '@angular/core';
import { NavController, IonicModule, PopoverController } from '@ionic/angular';
import { NgStyle } from '@angular/common';
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
    imports: [IonicModule, NgStyle],
    providers: [AuthFacade, PlatformProvider, AlertService]
})
export class HeaderComponent implements OnInit, OnDestroy {
    title = input.required({
        transform: (value: string) => {
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    });
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

        if (data?.deleteAccount) {
            const loggedInUser = localStorage.getItem('USER_EMAIL');
            const logOutModel: LogOutModel = {
                email: loggedInUser,
            };
            try {
                await this.authFacade.deleteAccount(logOutModel);
            } catch (error) {
                throw new Error('Error deleting account');
            }
        }
    }

    @HostListener('window:resize', ['$event'])
    public getScreenSize(): number {
        return window.innerHeight;
    }

    protected getHeaderThreshold(): {
        'padding-top': string;
        'margin-top': string;
        'margin-bottom': string;
    } {
        return this.platformProvider.getPlatform() === PlatformName.IOS
            ? {
                  'padding-top': '54px',
                  'margin-top': '54px',
                  'margin-bottom': '54px',
              }
            : { 'padding-top': '0', 'margin-top': '0', 'margin-bottom': '0' };
    }
    public ngOnDestroy(): void {}
}
