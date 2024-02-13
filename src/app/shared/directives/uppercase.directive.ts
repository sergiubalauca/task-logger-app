// first letter uppercase directive
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appUppercase]',
    standalone: true,
})
export class UppercaseDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('input', ['$event']) onInput(event: Event): void {
        const value = this.el.nativeElement.value;
        this.el.nativeElement.value =
            value.charAt(0).toUpperCase() + value.slice(1);
    }
}
