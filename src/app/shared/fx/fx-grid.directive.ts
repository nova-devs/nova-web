import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Directive({selector: "[fxGrid], [fxGrid.xs], [fxGrid.sm], [fxGrid.md], [fxGrid.lg], [fxGrid.xl]"})
export class FxGridDirective implements AfterViewInit {

    @Input("fxGrid") _fxGrid: string;
    @Input("fxGrid.xs") _fxGridXs: string;
    @Input("fxGrid.sm") _fxGridSm: string;
    @Input("fxGrid.md") _fxGridMd: string;
    @Input("fxGrid.lg") _fxGridLg: string;
    @Input("fxGrid.xl") _fxGridXl: string;

    constructor(private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) {
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
        this.renderer.setStyle(this.el.nativeElement, "display", "grid");
        this.updateGridStyles();
        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ]).subscribe(() => {
            this.updateGridStyles();
        });
    }

    private updateGridStyles() {
        if (this.breakpointObserver.isMatched(Breakpoints.XSmall) && this._fxGridXs) {
            this._fxGrid = this._fxGridXs;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Small) && this._fxGridSm) {
            this._fxGrid = this._fxGridSm;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Medium) && this._fxGridMd) {
            this._fxGrid = this._fxGridMd;
        } else if (this.breakpointObserver.isMatched(Breakpoints.Large) && this._fxGridLg) {
            this._fxGrid = this._fxGridLg;
        } else if (this.breakpointObserver.isMatched(Breakpoints.XLarge) && this._fxGridXl) {
            this._fxGrid = this._fxGridXl;
        }
        this.renderer.setStyle(this.el.nativeElement, "grid-template-columns", "repeat(" + this._fxGrid + ", 1fr)");
    }

}
