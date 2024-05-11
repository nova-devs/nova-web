import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2} from "@angular/core";

@Directive({selector: "[fxLayoutGap]"})
export class FxLayoutGapDirective implements AfterViewInit {
    private _fxLayoutGap: string;

    @Input() set fxLayoutGap(value: string) {
        this._fxLayoutGap = this.ensurePxUnit(value);
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
        if (this._fxLayoutGap === "13") {
            console.log(this._fxLayoutGap);
        }
        this.renderer.setStyle(this.el.nativeElement, "gap", this._fxLayoutGap);
    }

    private ensurePxUnit(value: string): string {
        return value.endsWith("px") ? value : value + "px";
    }

}
