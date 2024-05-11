import {Routes} from "@angular/router";
import {AppGuard} from "../../app/app.guard";
import {PreferencesComponent} from "./preferences/preferences.component";
import {PreferencesItemComponent} from "./preferences/preferences-item/preferences-item.component";

export const ROUTES: Routes = [
    {path: "preferences", component: PreferencesComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
    {path: "preferences/:action", component: PreferencesItemComponent, canActivate: [AppGuard], canDeactivate: [AppGuard]},
];
