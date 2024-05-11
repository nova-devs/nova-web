import {Component, Injector, OnInit} from "@angular/core";
import {URLS} from "../../../app/app.urls";
import {User} from "../../../models/account/user";
import {AuthService} from "../../../services/auth.service";
import {BaseComponent, BaseOptions} from "../../base.component";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

const BASE_OPTIONS: BaseOptions = {
    endpoint: URLS.USER,
    searchOnInit: true,
    keepFilters: true,
    formTitle: "user",
    formRoute: "/account/user/"
};

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"]
})
export class UserComponent extends BaseComponent<User> implements OnInit {
    displayedColunas: string[] = ['position', 'name', 'weight', 'symbol'];
    dataTable = ELEMENT_DATA;

    public displayedColumns = ["id", "username", "name", "email", "superuser", "active", "action"];
    public object: User = new User();

    constructor(public injector: Injector,
                public authService: AuthService) {
        super(injector, BASE_OPTIONS);

        if (!this.authService.user.is_superuser) {
            this.displayedColumns = ["id", "username", "name", "email", "active", "action"];
        }
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            username_or_name: [null],
        });
    }

    public search(restartIndex: boolean): void {
        this.service.clearParameter();
        this.service.addParameter("is_default", false);

        if (this.v.username_or_name) {
            this.service.addParameter("username_or_name", this.v.username_or_name);
        }
        super.search(restartIndex);
    }
}
