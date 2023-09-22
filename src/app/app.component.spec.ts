// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { TestBed, waitForAsync } from '@angular/core/testing';

// import { AppComponent } from './app.component';

// describe('AppComponent', () => {

//   beforeEach(waitForAsync(() => {

//     TestBed.configureTestingModule({
//     imports: [AppComponent],
//     schemas: [CUSTOM_ELEMENTS_SCHEMA],
// }).compileComponents();
//   }));

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   });
//   // TODO: add more tests!

// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'demo-angular-jest'`, () => {
        expect(component.title).toEqual('demo-angular-jest');
    });

    it('should render the title', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.content span')?.textContent).toContain(
            'demo-angular-jest app is running!'
        );
    });
});
