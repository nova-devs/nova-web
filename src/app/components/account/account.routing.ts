import {Routes} from "@angular/router";
import {AppGuard} from "../../app/app.guard";
import {UserComponent} from "./user/user.component";
import {UserItemComponent} from "./user/user-item/user-item.component";
import {GroupComponent} from "./group/group.component";
import {GroupItemComponent} from "./group/group-item/group-item.component";
import {ModuleComponent} from "./module/module.component";
import {ModuleItemComponent} from "./module/module-item/module-item.component";

export const ROUTES: Routes = [
    {path: "module", component: ModuleComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "module/:action", component: ModuleItemComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "user", component: UserComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "user/:action", component: UserItemComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "group", component: GroupComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "group/:action", component: GroupItemComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},,
];
