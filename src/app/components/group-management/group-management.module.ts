import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared.module";
import {GROUP_MANAGEMENT_ROUTES} from "./group-management.routing";
import {HomeComponent} from "../default/home/home.component";
import {ColorPickerModule} from "ngx-color-picker";
import {IConfig, provideEnvironmentNgxMask} from "ngx-mask";
import {MatChipsModule} from "@angular/material/chips";
import {ChurchGroupComponent} from "./church-group/church-group.component";
import {ChurchGroupItemComponent} from "./church-group/church-group-item/church-group-item.component";
import {AccountModule} from "../account/account.module";
import {ChurchGroupMemberComponent} from "./church-group/church-group-member/church-group-member.component";

const maskConfig: Partial<IConfig> = {validation: false};

@NgModule({
    declarations: [
        HomeComponent,
        ChurchGroupComponent,
        ChurchGroupItemComponent,
        ChurchGroupMemberComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ColorPickerModule,
        RouterModule.forChild(GROUP_MANAGEMENT_ROUTES),
        MatChipsModule,
        AccountModule,
    ],
    exports: [
        CommonModule
    ],
    providers: [
        provideEnvironmentNgxMask(maskConfig)
    ]
})
export class GroupManagementModule {
}
