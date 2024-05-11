import {Component, Injector, OnInit} from "@angular/core";
import {MainService} from "../../../../services/main.service";
import {URLS} from "../../../../app/app.urls";
import {CustomValidators} from "../../../../utilities/validator/custom-validators";
import {Settings} from "../../../../models/settings";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../../base.component";
import {Choice} from "../../../../dto/choice";

@Component({
    selector: "app-preferences-item",
    templateUrl: "./preferences-item.component.html",
    styleUrls: ["./preferences-item.component.scss"]
})
export class PreferencesItemComponent extends BaseComponent<Settings> implements OnInit {

    public object: Settings = new Settings();
    public keys: Choice[] = [];

    constructor(public mainService: MainService,
                public injector: Injector) {

        super(injector, {pk: "id", endpoint: URLS.SETTING, nextRoute: "/settings/preferences", retrieveOnInit: true});
        this.mainService.changeTitle.next("preferences");
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            value: [null, CustomValidators.required],
            key: [null, CustomValidators.required],
        });
    }

    public getKeys(): void {
        this.service.clearParameter();
        this.service.getChoices("key")
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => this.keys = response);
    }
}
