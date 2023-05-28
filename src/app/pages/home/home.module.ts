import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
    imports: [CommonModule, IonicModule, HomePageRoutingModule, HomeComponent],
})
export class HomeModule {}
