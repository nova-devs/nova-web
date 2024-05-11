import {Routes} from "@angular/router";
import {AppGuard} from "./app/app.guard";
import {MainComponent} from "./components/default/main/main.component";
import {PageNotfoundComponent} from "./components/default/page-notfound/page-notfound.component";
import {LoginComponent} from "./components/default/login/login.component";
import {RecoverPasswordComponent} from "./components/default/recover-password/recover-password.component";
import {HomeComponent} from "./components/default/home/home.component";

export const ROUTES: Routes = [
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "recover",
        component: RecoverPasswordComponent,
    },
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full"
            },
            {
                path: "home",
                component: HomeComponent,
                canActivate: [AppGuard],
                canDeactivate: [AppGuard]
            },
            {
                path: "account",
                loadChildren: () => import("./components/account/account.module").then(m => m.AccountModule),
                canLoad: [AppGuard]
            },
            {
                path: "church_group_management",
                loadChildren: () => import("./components/group-management/group-management.module").then(m => m.GroupManagementModule),
                canLoad: [AppGuard]
            },
            {
                path: "settings",
                loadChildren: () => import("./components/settings/settings.module").then(m => m.SettingsModule),
                canLoad: [AppGuard]
            },
            {
                path: "**",
                component: PageNotfoundComponent
            },
        ]
    }
];
