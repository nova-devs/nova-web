import {TranslateService} from "../services/translate.service";
import {Injectable, OnDestroy} from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl implements OnDestroy {

    private unsubscribe = new Subject();
    private _itemsPerPageLabel: string;
    private _nextPageLabel: string;
    private _previousPageLabel: string;

    constructor(public translate: TranslateService) {
        super();
        this.loadTranslations();
        this.translate.onLangChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => this.loadTranslations());
    }

    public ngOnDestroy() {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    private loadTranslations(): void {
        this._itemsPerPageLabel = this.translate._("items-per-page");
        this.firstPageLabel = this.translate._("first-page");
        this._nextPageLabel = this.translate._("next-page");
        this._previousPageLabel = this.translate._("previous-page");
        this.lastPageLabel = this.translate._("last-page");
    }

    getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
            return `0 ${this.translate._("of")} ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} ${this.translate._("of")} ${length}`;
    };

}
