import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ROUTES} from "./account.routing";
import {UserComponent} from "./user/user.component";
import {UserItemComponent} from "./user/user-item/user-item.component";
import {GroupComponent} from "./group/group.component";
import {GroupItemComponent} from "./group/group-item/group-item.component";
import {UserGroupComponent} from "./user/user-group/user-group.component";
import {PermissionComponent} from "./permission/permission.component";
import {MenuPermissionComponent} from "./group/menu-permission/menu-permission.component";
import {ModuleComponent} from "./module/module.component";
import {ModuleItemComponent} from "./module/module-item/module-item.component";
import {ModuleRootComponent} from "./module/module-root/module-root.component";
import {ModuleMenuItemDialogComponent} from "./module/module-root/module-menu-item-dialog/module-menu-item-dialog.component";
import {ModulePermissionComponent} from "./group/module-permission/module-permission.component";
import {GroupUserComponent} from "./group/group-user/group-user.component";
import {ModuleRootDialogComponent} from "./module/module-root/module-root-dialog/module-root-dialog.component";
import {SharedModule} from "../../shared.module";
import {MatChipSet, MatChipsModule} from "@angular/material/chips";
@NgModule({
    declarations: [
        UserComponent,
        GroupComponent,
        GroupItemComponent,
        GroupUserComponent,
        UserGroupComponent,
        PermissionComponent,
        MenuPermissionComponent,
        ModuleComponent,
        ModulePermissionComponent,
        ModuleItemComponent,
        ModuleRootComponent,
        ModuleMenuItemDialogComponent,
        ModuleRootDialogComponent,
        UserItemComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatChipsModule,
        RouterModule.forChild(ROUTES),
    ],
    exports: [
        UserGroupComponent,
        MatChipSet,
        CommonModule,
    ]
})
export class AccountModule {
}

