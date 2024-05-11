import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({selector: "[fxFill]"})
export class FxFillDirective implements AfterViewInit {
    private _fxFill: string;

    @Input() set fxFlex(value: string) {
        this._fxFill = value;
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
        this.renderer.setStyle(this.el.nativeElement, "min-width", "100%");
        this.renderer.setStyle(this.el.nativeElement, "min-height", "100%");
    }

}
