import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MobileAccessibility } from '@awesome-cordova-plugins/mobile-accessibility';
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class AppComponent implements OnInit {
    public title = 'demo-angular-jest';

    constructor(
        translateService: TranslateService,
        private platform: Platform
    ) {
        translateService.setDefaultLang('en');
        translateService.use('en');
    }

    public async ngOnInit() {
        try {
            const isPlatformReady = await this.platform.ready();
            if (isPlatformReady) {
                await this.setTextZoom();
            }
        } catch (error) {}
    }

    private async setTextZoom() {
        const textZoom = await MobileAccessibility.getTextZoom();

        if (textZoom > 100) {
            MobileAccessibility.setTextZoom(100);
        }
    }
}
