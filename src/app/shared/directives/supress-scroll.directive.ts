import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[supressTouchMove]',
    standalone: true,
})
export class SuppressTouchMoveDirective implements OnInit {
    public constructor(private el: ElementRef) {}

    public ngOnInit(): void {
        if (!this.el || !this.el.nativeElement) {
            return;
        }

        this.el.nativeElement.ontouchmove = (e: TouchEvent) =>
            e.stopPropagation();
    }
}
