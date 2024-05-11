import {Directive, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {TranslateService} from "../services/translate.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Directive({
    selector: "mat-select[choicesEvent], mat-table[choicesEvent]",
})
export class ChoicesDirective implements OnInit, OnDestroy {

    private unsubscribe = new Subject();

    @Output() choicesEvent = new EventEmitter();

    constructor(public translate: TranslateService) {
    }

    public ngOnInit() {
        this.choicesEvent.emit();
        this.translate.onLangChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => this.choicesEvent.emit());
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }
}
