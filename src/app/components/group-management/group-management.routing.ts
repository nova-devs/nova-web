import {Routes} from "@angular/router";
import {AppGuard} from "../../app/app.guard";
import {ChurchGroupComponent} from "./church-group/church-group.component";
import {ChurchGroupItemComponent} from "./church-group/church-group-item/church-group-item.component";

export const GROUP_MANAGEMENT_ROUTES: Routes = [
    {path: "church_group", component: ChurchGroupComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "church_group/:action", component: ChurchGroupItemComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
];
