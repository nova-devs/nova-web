import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent, BaseOptions} from "../../../base.component";
import {AuthService} from "../../../../services/auth.service";
import {URLS} from "../../../../app/app.urls";
import {CustomValidators} from "../../../../utilities/validator/custom-validators";
import {ChurchGroup} from "../../../../models/church-group-management/church-group";
import {MainService} from "../../../../services/main.service";
import {takeUntil} from "rxjs/operators";
import {Choice} from "../../../../dto/choice";

const COMPONENT_OPTIONS: BaseOptions = {
    pk: "id",
    endpoint: URLS.CHURCH_GROUP,
    nextRouteUpdate: "/church_group_management/church_group/",
    retrieveOnInit: true,
    formTitle: "church-groups",
    formRoute: "/church_group_management/church_group/"
};

@Component({
    selector: 'app-church-group-item',
    templateUrl: './church-group-item.component.html',
    styleUrl: './church-group-item.component.css'
})
export class ChurchGroupItemComponent extends BaseComponent<ChurchGroup> implements OnInit {
    public object: ChurchGroup = new ChurchGroup();
    public types: Choice[] = [];
    public categories: Choice[] = [];

    constructor(public injector: Injector,
                public mainService: MainService,) {
        super(injector, COMPONENT_OPTIONS);
        this.mainService.changeTitle.next(COMPONENT_OPTIONS.formTitle);
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            description: [null, CustomValidators.compose([CustomValidators.required, CustomValidators.maxLength(256)])],
            category: [null, CustomValidators.compose([CustomValidators.required, CustomValidators.maxLength(2)])],
            type: [null, CustomValidators.compose([CustomValidators.required, CustomValidators.maxLength(2)])],
        });
    }
    public getTypes(): void {
        this.service.clearParameter();
        this.service.getChoices("type")
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => this.types = response);
    }

    public getCategories(): void {
        this.service.clearParameter();
        this.service.getChoices("category")
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => this.categories = response);
    }

}
