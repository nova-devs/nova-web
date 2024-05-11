import {MenuItem} from "../components/default/main/menu/menu.component";
import {User} from "../models/account/user";
import {Injectable} from "@angular/core";

@Injectable()
export class AppVariables {
    user?: User;
    menu?: MenuItem[];
    routes?: string[];
}
