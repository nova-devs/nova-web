import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MenuComponent} from "./menu/menu.component";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {
    MatActionList,
    MatListItem,
    MatListItemIcon,
    MatListModule,
    MatListOption
} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MainComponent} from "./main.component";
import {MainService} from "../../../services/main.service";
import {SharedModule} from "../../../shared.module";
import {ChangePasswordDialogComponent} from "../../account/user/change-password-dialog/change-password-dialog.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatChipsModule} from "@angular/material/chips";
import { ModulesDialogComponent } from './modules-dialog/modules-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        SharedModule,
        TranslateModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatCardModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatBadgeModule,
        MatChipsModule,
    ],
    declarations: [
        MainComponent,
        MenuComponent,
        ChangePasswordDialogComponent,
        ModulesDialogComponent,
    ],
    providers: [
        MainService,
    ],
    exports: [
        MatListOption,
        MatListItemIcon,
        MatActionList,
        MatListItem,
        CommonModule
    ]
})
export class MainModule {
}
