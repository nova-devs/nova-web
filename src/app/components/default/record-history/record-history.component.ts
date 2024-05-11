import {Component, Inject, Injector} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseService} from "../../../services/base.service";
import {TranslateService} from "../../../services/translate.service";
import {BaseComponent} from "../../base.component";
import {Observable, of} from "rxjs";
import {ModelBase} from "../../../models/model-base";

export interface ServiceData {
    pk: string | number;
    label: string;
    service: BaseService<ModelBase>;
    associateModel: string | null;
}

export interface DialogData {
    pk: number | string;
    baseUrl?: string;
    services: ServiceData[];
}

@Component({
    selector: "app-record-history",
    templateUrl: "./record-history.component.html",
    styleUrls: ["./record-history.component.scss"]
})
export class RecordHistoryComponent extends BaseComponent<ModelBase> {
    constructor(public translate: TranslateService,
                public injector: Injector,
                public dialogRef: MatDialogRef<RecordHistoryComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        super(injector, {pk: data.pk.toString(), endpoint: data.baseUrl});
    }

    createFormGroup(): void {
    }

    public beforeRetrieve(): Observable<number | string> {
        return of(this.data.pk);
    }

}
