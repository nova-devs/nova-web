import {Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {debounceTime, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";

@Directive({
    selector: "button[dbnclick]"
})
export class DebounceClickDirective implements OnInit, OnDestroy {

    private unsubscribe = new Subject();

    @Input() dbntime = 200;
    @Output() dbnclick = new EventEmitter();

    private clicks = new Subject();

    public ngOnInit() {
        this.clicks.pipe(
            takeUntil(this.unsubscribe),
            debounceTime(this.dbntime)
        ).subscribe(e => this.dbnclick.emit(e));
    }

    public ngOnDestroy() {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    @HostListener("click", ["$event"])
    public onClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
