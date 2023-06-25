import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class AppComponent {
    constructor(translateService: TranslateService) {
        translateService.setDefaultLang('en');
        translateService.use('en');
    }
}
