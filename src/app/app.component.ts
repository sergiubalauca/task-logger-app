import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TextZoom } from '@capacitor/text-zoom';

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
        } catch (error) {
            throw new Error('Failed to set zoom level');
        }
    }

    private async setTextZoom() {
        const currentZoomLevel = await TextZoom.get();
        const preferedZoomLevel = await TextZoom.getPreferred();

        if (currentZoomLevel.value > 1 || preferedZoomLevel.value > 1) { 
            await TextZoom.set({ value: 1 });
        }
    }
}
