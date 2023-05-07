import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
    constructor(private navController: NavController) {}

    ngOnInit() {}

    public async goToDoctorsList(): Promise<boolean> {
        return this.navController.navigateForward('/home/setup/doctors');
    }

    public async goToWorkItemsList(): Promise<boolean> {
        return this.navController.navigateForward('/home/setup/work-items');
    }
}
