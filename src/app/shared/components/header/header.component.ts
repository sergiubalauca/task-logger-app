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
  @Input() showBackButton: boolean;
  @Input() public headerSubtitle: string;
  @Input() public backBtnEnabled: boolean;
  @Input() public backBtnIconClose: boolean;
  @Input() public searchSortFilterEnabled: boolean;
  @Input() public exportEnabled: boolean;

  public constructor(private navController: NavController) {}

  public ngOnInit(): void {}

  public goBack(): void {
    this.navController.pop();
  }

  public openPopover(e: any): void {
    if (!this.exportEnabled) {
      return;
    }
  }

  public ngOnDestroy(): void {}
}
