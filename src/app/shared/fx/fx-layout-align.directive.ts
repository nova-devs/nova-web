import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Directive({
    selector: "[fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md], [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-lg]"
})
export class FxLayoutAlignDirective implements AfterViewInit {

    @Input("fxLayoutAlign") _fxLayoutAlign: string;
    @Input("fxLayoutAlign.xs") _fxLayoutAlignXs: string;
    @Input("fxLayoutAlign.sm") _fxLayoutAlignSm: string;
    @Input("fxLayoutAlign.md") _fxLayoutAlignMd: string;
    @Input("fxLayoutAlign.lg") _fxLayoutAlignLg: string;
    @Input("fxLayoutAlign.xl") _fxLayoutAlignXl: string;
    @Input("fxLayoutAlign.lt-sm") _fxLayoutAlignLtSm: string;
    @Input("fxLayoutAlign.lt-lg") _fxLayoutAlignLtLg: string;

    constructor(
        private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) {
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
        this.applyLayoutAlignStyles();

        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ]).subscribe(() => {
            this.applyLayoutAlignStyles();
        });
    }

    private applyLayoutAlignStyles() {
        let mainAxis: string, crossAxis: string;

        if (this.breakpointObserver.isMatched(Breakpoints.XSmall) && this._fxLayoutAlignXs) {
            [mainAxis, crossAxis] = this._fxLayoutAlignXs.split(" ");
        } else if (this.breakpointObserver.isMatched(Breakpoints.Small) && this._fxLayoutAlignSm) {
            [mainAxis, crossAxis] = this._fxLayoutAlignSm.split(" ");
        } else if (this.breakpointObserver.isMatched(Breakpoints.Medium) && this._fxLayoutAlignMd) {
            [mainAxis, crossAxis] = this._fxLayoutAlignMd.split(" ");
        } else if (this.breakpointObserver.isMatched(Breakpoints.Large) && this._fxLayoutAlignLg) {
            [mainAxis, crossAxis] = this._fxLayoutAlignLg.split(" ");
        } else if (this.breakpointObserver.isMatched('(max-width: 599.99px)') && this._fxLayoutAlignLtSm) {
            [mainAxis, crossAxis] = this._fxLayoutAlignLtSm.split(" ");
        } else if (this.breakpointObserver.isMatched('(max-width: 959.99px)') && this._fxLayoutAlignLtLg) {
            [mainAxis, crossAxis] = this._fxLayoutAlignLtLg.split(" ");
        } else if (this._fxLayoutAlign){
            [mainAxis, crossAxis] = this._fxLayoutAlign.split(" ");
        }

        this.renderer.setStyle(this.el.nativeElement, "display", "flex");
        this.renderer.setStyle(this.el.nativeElement, "align-items", crossAxis);
        this.renderer.setStyle(this.el.nativeElement, "place-content", crossAxis + " " + mainAxis);
    }

}
