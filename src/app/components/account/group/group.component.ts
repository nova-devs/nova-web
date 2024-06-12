import {Component, Injector, OnInit} from "@angular/core";
import {URLS} from "../../../app/app.urls";
import {Group} from "../../../models/account/group";
import {BaseComponent, BaseOptions} from "../../base.component";

const BASE_OPTIONS: BaseOptions = {
    endpoint: URLS.GROUP,
    searchOnInit: true,
    keepFilters: true,
    formTitle: "group",
    formRoute: "/account/group/"
};

@Component({
    selector: "app-group",
    templateUrl: "./group.component.html",
    styleUrls: ["./group.component.scss"]
})
export class GroupComponent extends BaseComponent<Group> implements OnInit {

    public displayedColumns = ["id", "name", "action"];
    public object: Group = new Group();

    constructor(public injector: Injector) {
        super(injector, BASE_OPTIONS);
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            name: [null],
        });
    }

    public search(restartIndex: boolean): void {

        this.service.clearParameter();
        if (this.v.name) {
            this.service.addParameter("name", this.v.name);
        }
        super.search(restartIndex);
    }
}
