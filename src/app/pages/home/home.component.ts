import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
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
}
