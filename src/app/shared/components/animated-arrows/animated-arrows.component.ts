import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-animated-arrows',
    templateUrl: './animated-arrows.component.html',
    styleUrls: ['./animated-arrows.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf, NgStyle],
})
export class AnimatedArrowsComponent {}
