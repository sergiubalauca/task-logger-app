import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
