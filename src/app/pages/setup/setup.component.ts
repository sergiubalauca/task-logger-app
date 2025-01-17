import { Component, OnInit } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.scss'],
    imports: [HeaderComponent, IonicModule]
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
