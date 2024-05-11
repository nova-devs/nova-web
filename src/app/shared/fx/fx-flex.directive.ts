import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Directive({selector: "[fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md], [fxFlex.lg], [fxFlex.xl]"})
export class FxFlexDirective implements AfterViewInit {

    @Input("fxFlex") _fxFlex: string;
    @Input("fxFlex.xs") _fxFlexXs: string;
    @Input("fxFlex.sm") _fxFlexSm: string;
    @Input("fxFlex.md") _fxFlexMd: string;
    @Input("fxFlex.lg") _fxFlexLg: string;
    @Input("fxFlex.xl") _fxFlexXl: string;

    constructor(private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) {
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
        this.applyFlexStyles();
        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ]).subscribe(() => {
            this.applyFlexStyles();
        });
    }

    private applyFlexStyles() {
        let flexValue = this._fxFlex;
        const parentElement = this.el.nativeElement.parentElement;

        if (parentElement) {
            this.renderer.setStyle(parentElement, "display", "flex");
            this.renderer.setStyle(parentElement, "box-sizing", "border-box");
        }

        if (this.breakpointObserver.isMatched(Breakpoints.XSmall) && this._fxFlexXs) {
            flexValue = this._fxFlexXs;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Small) && this._fxFlexSm) {
            flexValue = this._fxFlexSm;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Medium) && this._fxFlexMd) {
            flexValue = this._fxFlexMd;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Large) && this._fxFlexLg) {
            flexValue = this._fxFlexLg;
        } else if (this.breakpointObserver.isMatched(Breakpoints.XLarge) && this._fxFlexXl) {
            flexValue = this._fxFlexXl;
        }

        if (!flexValue) {
            flexValue = "100%";
        } else if (!flexValue.includes("px") || !flexValue.includes("%")) {
            flexValue = flexValue ? flexValue + "%" : "100%";
        }

        this.renderer.setStyle(this.el.nativeElement, "flex", "1 1 " + flexValue);
    }
}
