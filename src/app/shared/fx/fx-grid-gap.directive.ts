import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({selector: "[fxGridGap]"})
export class FxGridGapDirective implements AfterViewInit {
    private _fxGridGap: string;

    @Input() set fxGridGap(value: string) {
        this._fxGridGap = this.ensurePxUnit(value);
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef) {
    }

    public ngAfterViewInit() {
        this.cdr.detectChanges();
        setTimeout(() => {
            this.cdr.detectChanges();
            const observer = new MutationObserver(() => {
                this.applyLayoutGap();
            });
            observer.observe(this.el.nativeElement, {childList: true, subtree: true});
            this.applyLayoutGap();
        });
    }

    public applyLayoutGap() {
        if (this._fxGridGap.length > 1) {
            this.renderer.setStyle(this.el.nativeElement, "grid-column-gap", this._fxGridGap[0]);
            this.renderer.setStyle(this.el.nativeElement, "grid-row-gap", this._fxGridGap[1]);
        } else {
            this.renderer.setStyle(this.el.nativeElement, "gap", this._fxGridGap[0]);
        }
    }

    private ensurePxUnit(value: string): any {
        if (value.includes(" ")) {
            const gaps = value.split(" ");
            const columnGap = gaps[0].endsWith("px") ? gaps[0] : gaps[0] + "px";
            const rowGap = gaps[1].endsWith("px") ? gaps[1] : gaps[1] + "px";
            return [columnGap, rowGap];
        } else {
            return [value.endsWith("px") ? value : value + "px"];
        }
    }

}
