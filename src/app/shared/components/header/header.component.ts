import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf],
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() public headerSubtitle: string;
  @Input() public backBtnEnabled: boolean;
  @Input() public backBtnIconClose: boolean;

  public constructor(private navController: NavController) {}

  public ngOnInit(): void {}

  public goBack(): void {
    this.navController.pop();
  }

  public ngOnDestroy(): void {}
}
