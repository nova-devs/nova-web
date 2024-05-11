import {OnDestroy, Pipe, PipeTransform} from "@angular/core";
import {getLocaleCurrencySymbol} from "@angular/common";
import {TranslateService} from "../services/translate.service";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";

@Pipe({
    name: "localCurrency",
    pure: false
})
export class LocalCurrencyPipe implements PipeTransform, OnDestroy {

    private unsubscribe = new Subject();
    public value: number;

    constructor(public translate: TranslateService) {
        translate.onLangChange.pipe(
            takeUntil(this.unsubscribe),
            distinctUntilChanged()
        ).subscribe(() => this.transformDate());
    }

    public ngOnDestroy() {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    public transform(value: any): any {
        this.value = value;
        return this.transformDate();
    }

    public transformDate(): any {
        const options = {
            style: "decimal",
            minimumFractionDigits: 2
        };
        const symbol = getLocaleCurrencySymbol(this.translate.currentLang);
        const number = new Intl.NumberFormat(this.translate.currentLang, options).format(this.value);
        return symbol + " " + number;
    }
}
