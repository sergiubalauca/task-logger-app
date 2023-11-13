import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { NavController, IonicModule, PopoverController } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { SettingsPopoverComponent } from '../settings-popover/settings-popover.component';
import { AuthFacade } from '@abstraction';
import { LogOutModel } from '../../models';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf],
    providers: [AuthFacade],
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() title: string;
    @Input() public headerSubtitle: string;
    @Input() public backBtnEnabled: boolean;
    @Input() public backBtnIconClose: boolean;

    public constructor(
        private navController: NavController,
        public popoverController: PopoverController,
        private authFacade: AuthFacade
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

    public ngOnDestroy(): void {}
}
