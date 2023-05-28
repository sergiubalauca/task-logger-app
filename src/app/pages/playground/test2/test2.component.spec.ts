import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Test2Component } from './test2.component';

describe('Test2Component', () => {
  let component: Test2Component;
  let fixture: ComponentFixture<Test2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), Test2Component]
}).compileComponents();

    fixture = TestBed.createComponent(Test2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
