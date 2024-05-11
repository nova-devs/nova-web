import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent, BaseOptions} from "../../base.component";
import {URLS} from "../../../app/app.urls";
import {MainService} from "../../../services/main.service";
import {takeUntil} from "rxjs/operators";
import {Choice} from "../../../dto/choice";
import {ChurchGroup} from "../../../models/church-group-management/church-group";


const COMPONENT_OPTIONS: BaseOptions = {
    endpoint: URLS.CHURCH_GROUP,
    searchOnInit: true,
    keepFilters: false,
    formRoute: "/church_group_management/church_group/"
};

@Component({
    selector: 'app-church-group.ts',
    templateUrl: './church-group.component.html',
    styleUrl: './church-group.component.scss'
})
export class ChurchGroupComponent extends BaseComponent<ChurchGroup> implements OnInit {
    public displayedColumns = ["description", "category", "type", "created_at", "modified_at", "is_active", "action"];
    public types: Choice[] = [];
    public categories: Choice[] = [];

    constructor(public mainService: MainService,
                public injector: Injector) {

        super(injector, COMPONENT_OPTIONS);
        this.mainService.changeTitle.next("church-groups");
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            description: [null],
            category: [null],
            type: [null],
            is_active: [true],
        });
    }

    public ngOnInit() {
        super.ngOnInit(() => {
            this.getCategories();
            this.getTypes();
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

    public search() {
        this.service.clearParameter();
        this.service.addParameter("description", this.v.description ?? "");
        this.service.addParameter("category", this.v.category ?? "");
        this.service.addParameter("type", this.v.type ?? "");
        this.service.addParameter("is_active", this.v.is_active ?? "");
        this.service.addParameter("fields", "id,description,category,type,created_at,modified_at,is_active");
        super.search();
    }

}
