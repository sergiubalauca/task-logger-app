import { Component, OnInit } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [HeaderComponent, IonicModule]
})
export class HomeComponent implements OnInit {
    constructor(private navController: NavController) {}

    ngOnInit() {}

    public async openLogWork(): Promise<boolean> {
        return await this.navController.navigateForward('/home/log-work');
    }

    public async openSetup(): Promise<boolean> {
        return await this.navController.navigateForward('/home/setup');
    }

    public async openReports(): Promise<boolean> {
        return await this.navController.navigateForward('/home/reports');
    }
}
