import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home.component';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '@shared';

@NgModule({
    declarations: [HomeComponent],
    imports: [CommonModule, IonicModule, HomePageRoutingModule, SharedModule],
    // imports: [CommonModule, FormsModule, IonicModule, TranslateModule, SharedModule, ReactiveFormsModule],
})
export class HomeModule {}
