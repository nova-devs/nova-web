import {Component, Injector, OnInit} from "@angular/core";
import {Settings} from "../../../models/settings";
import {MainService} from "../../../services/main.service";
import {URLS} from "../../../app/app.urls";
import {takeUntil} from "rxjs/operators";
import {BaseComponent, BaseOptions} from "../../base.component";
import {Choice} from "../../../dto/choice";

const PREFERENCES_OPTIONS: BaseOptions = {
    endpoint: URLS.SETTING,
    searchOnInit: true,
    keepFilters: true,
    formRoute: "/settings/preferences/"
};

@Component({
    selector: "app-preferences",
    templateUrl: "./preferences.component.html",
    styleUrls: ["./preferences.component.scss"]
})
export class PreferencesComponent extends BaseComponent<Settings> implements OnInit {

    public displayedColumns = ["name", "value", "modified_at", "action"];
    public object: Settings = new Settings();
    public keys: Choice[] = [];

    constructor(public mainService: MainService,
                public injector: Injector) {

        super(injector, PREFERENCES_OPTIONS);
        this.mainService.changeTitle.next("settings");
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            key: [null],
        });
    }

    public getKeys(): void {
        this.service.clearParameter();
        this.service.getChoices("key")
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => this.keys = response);
    }

    public search(restartIndex: boolean): void {
        this.service.clearParameter();
        if (this.v.key) {
            this.service.addParameter("key", this.v.key);
        }
        super.search(restartIndex);
    }
}
