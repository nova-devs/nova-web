import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared.module";
import {ROUTES} from "./settings.routing";
import {PreferencesComponent} from "./preferences/preferences.component";
import {PreferencesItemComponent} from "./preferences/preferences-item/preferences-item.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        PreferencesComponent,
        PreferencesItemComponent,
    ]
})
export class SettingsModule {
}
