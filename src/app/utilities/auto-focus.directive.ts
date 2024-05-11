import {AfterViewInit, Directive, ElementRef} from "@angular/core";

@Directive({
    selector: `[autoFocus]`,
    exportAs: "autoFocus"
})
export class AutoFocusDirective implements AfterViewInit {

    constructor(public element: ElementRef) {
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.element.nativeElement.focus();
        }, 200);
    }
}
