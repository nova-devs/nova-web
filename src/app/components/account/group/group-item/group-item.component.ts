import {Component, Injector, OnInit} from "@angular/core";
import {URLS} from "../../../../app/app.urls";
import {CustomValidators} from "../../../../utilities/validator/custom-validators";
import {Group} from "../../../../models/account/group";
import {BaseComponent, BaseOptions} from "../../../base.component";

const BASE_OPTIONS: BaseOptions = {
    endpoint: URLS.GROUP,
    retrieveOnInit: true,
    nextRouteUpdate: "/account/group",
    formTitle: "group",
    formRoute: "/account/user/"
};

@Component({
    selector: "app-group-item",
    templateUrl: "./group-item.component.html",
    styleUrls: ["./group-item.component.scss"]
})
export class GroupItemComponent extends BaseComponent<Group> implements OnInit {

    public object: Group = new Group();

    constructor(public injector: Injector) {
        super(injector, BASE_OPTIONS);
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            name: [null, CustomValidators.required],
        });
    }
}
