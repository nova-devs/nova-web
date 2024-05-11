import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Directive({
    selector: "[fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-lg], [fxLayout.lt-sm"
})
export class FxLayoutDirective implements AfterViewInit {

    @Input("fxLayout") _fxLayout: string;
    @Input("fxLayout.xs") _fxLayoutXs: string;
    @Input("fxLayout.sm") _fxLayoutSm: string;
    @Input("fxLayout.md") _fxLayoutMd: string;
    @Input("fxLayout.lg") _fxLayoutLg: string;
    @Input("fxLayout.xl") _fxLayoutXl: string;
    @Input("fxLayout.lt-lg") _fxLayoutLtLg: string;
    @Input("fxLayout.lt-sm") _fxLayoutLtSm: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private cdr: ChangeDetectorRef,
        private breakpointObserver: BreakpointObserver
    ) {
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
        this.applyFlexLayoutStyles();

        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ]).subscribe(() => {
            this.applyFlexLayoutStyles();
        });
    }

    private applyFlexLayoutStyles() {
        const validValues = ["row", "column", "row-reverse", "column-reverse"];
        const validFlexFlow = ["row wrap"];
        let flexLayoutValue = this._fxLayout;

        if (this.breakpointObserver.isMatched(Breakpoints.XSmall) && this._fxLayoutXs) {
            flexLayoutValue = this._fxLayoutXs;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Small) && this._fxLayoutSm) {
            flexLayoutValue = this._fxLayoutSm;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Medium) && this._fxLayoutMd) {
            flexLayoutValue = this._fxLayoutMd;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Large) && this._fxLayoutLg) {
            flexLayoutValue = this._fxLayoutLg;
        } else if (this.breakpointObserver.isMatched(Breakpoints.XLarge) && this._fxLayoutXl) {
            flexLayoutValue = this._fxLayoutXl;
        } else if (this.breakpointObserver.isMatched('(max-width: 959.99px)') && this._fxLayoutLtLg) {
            flexLayoutValue = this._fxLayoutLtLg;
        } else if (this.breakpointObserver.isMatched('(max-width: 599.99px)') && this._fxLayoutLtSm) {
            flexLayoutValue = this._fxLayoutLtSm;
        }

        if (validValues.includes(flexLayoutValue)) {
            this.renderer.setStyle(this.el.nativeElement, "flex-direction", flexLayoutValue);
        } else if (validFlexFlow.includes(flexLayoutValue)) {
            this.renderer.setStyle(this.el.nativeElement, "flex-flow", "wrap");
        } else {
            this.renderer.setStyle(this.el.nativeElement, "flex-direction", "row");
        }

        this.renderer.setStyle(this.el.nativeElement, "display", "flex");
    }
}
