import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SwiperComponent } from './swiper.component';

describe('SwiperComponent', () => {
  let component: SwiperComponent;
  let fixture: ComponentFixture<SwiperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), SwiperComponent]
}).compileComponents();

    fixture = TestBed.createComponent(SwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
