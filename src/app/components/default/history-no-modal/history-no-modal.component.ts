import {Component, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {takeUntil} from "rxjs/operators";
import {Version} from "../../../dto/history/version";
import {Subject} from "rxjs";
import {LocalDatePipe} from "../../../utilities/local-date.pipe";
import {TranslateService} from "../../../services/translate.service";
import {Utils} from "../../../utilities/utils";
import {BaseService} from "../../../services/base.service";


@Component({
    selector: "app-history-no-modal",
    templateUrl: "./history-no-modal.component.html",
    styleUrls: ["./history-no-modal.component.scss"],
})
export class HistoryNoModalComponent<T> implements OnInit, OnDestroy {

    private unsubscribe = new Subject();

    @Input() pk: number | string;
    @Input() service: BaseService<T>;
    @Input() associateModel: string | null;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    public historyList: any[] = [];
    public keys = Object.keys;

    constructor(public translate: TranslateService) {
    }

    public ngOnInit() {
        this.createPaginator();
        this.search();
    }

    public ngOnDestroy() {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    public search(): void {
        this.service.clearParameter();
        this.service.addParameter("limit", this.paginator.pageSize);
        this.service.addParameter("offset", (this.paginator.pageIndex * this.paginator.pageSize));
        if (this.associateModel) {
            this.service.addParameter("associate_model", this.associateModel);
        }
        const path = this.associateModel ? "associate_history" : "history";
        this.service.getPaginatedFromDetailRoute<Version<T>>(this.pk, path)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((response) => {
                this.paginator.length = response.count;
                this.historyList = response.results;
            });
    }

    public getValue(value): string {
        try {
            if (value === null || typeof value === "undefined") {
                return value;
            }
            if (typeof value === "boolean") {
                return value ? this.translate._("yes") : this.translate._("no");
            } else if (Utils.isDate(value)) {
                return new LocalDatePipe(this.translate).transform(value);
            } else {
                return value;
            }
        } catch (e) {
            return value;
        }
    }

    public normalize(key: string): string {
        return key
            .replace("is_", "")
            .replace("has_", "")
            .replace(new RegExp("_id$"), "")
            .replace(new RegExp("_", "g"), "-")
            .toLowerCase();
    }

    private createPaginator(): void {
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = 10;
        this.paginator.pageSizeOptions = [5, 10, 25, 50];
    }
}
