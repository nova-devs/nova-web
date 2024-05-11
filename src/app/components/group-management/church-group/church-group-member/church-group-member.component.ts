import {Component, Injector, Input, OnInit} from '@angular/core';
import {BaseComponent, BaseOptions} from "../../../base.component";
import {ChurchGroupUser} from "../../../../models/church-group-management/church-group-member";
import {Choice} from "../../../../dto/choice";
import {URLS} from "../../../../app/app.urls";
import {MainService} from "../../../../services/main.service";
import {ChurchGroup} from "../../../../models/church-group-management/church-group";
import {takeUntil} from "rxjs/operators";
import {CustomValidators} from "../../../../utilities/validator/custom-validators";

const COMPONENT_OPTIONS: BaseOptions = {
    endpoint: URLS.CHURCH_GROUP_USER,
    searchOnInit: true,
    keepFilters: false,
    formRoute: "/church_group_management/church_group/"
};

@Component({
    selector: 'app-church-group-member',
    templateUrl: './church-group-member.component.html',
    styleUrl: './church-group-member.component.css'
})
export class ChurchGroupMemberComponent extends BaseComponent<ChurchGroupUser> implements OnInit {
    public displayedColumns = ["user", "association_type", "created_at", "modified_at", "is_active", "action"];
    @Input() churchGroup: ChurchGroup;
    public associationTypes: Choice[] = [];

    constructor(public mainService: MainService,
                public injector: Injector) {

        super(injector, COMPONENT_OPTIONS);
    }


    public ngOnInit() {
        super.ngOnInit(() => {
            this.getAssociationTypes();
        });
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            user: [null],
            association_type: [null],
            is_active: [true],
            church_group: [this.churchGroup.id],
        });
    }

    public getAssociationTypes(): void {
        this.service.clearParameter();
        this.service.getChoices("association_type")
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => this.associationTypes = response);
    }

    public search() {
        this.service.clearParameter();
        this.service.addParameter("church_group_id", this.churchGroup.id);
        this.service.addParameter("user", this.v.user ?? "");
        this.service.addParameter("association_type", this.v.association_type ?? "");
        this.service.addParameter("is_active", this.v.is_active ?? "");
        this.service.addParameter("expand", "user");
        super.search();
    }

}
