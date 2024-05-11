import {AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef} from "@angular/core";
import {AuthService} from "../../../services/auth.service";
import {TranslateService} from "../../../services/translate.service";
import {MainService} from "../../../services/main.service";
import {SIDENAV_CONTENT_EXPANDED, SIDENAV_EXPANDED} from "./menu/menu.animation";
import {MenuItem} from "./menu/menu.component";
import {distinctUntilChanged, take, takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {MatSidenav} from "@angular/material/sidenav";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {User} from "../../../models/account/user";
import {AppVariables} from "../../../app/app.variables";
import {Subject} from "rxjs";
import {Utils} from "../../../utilities/utils";
import {CUSTOM_DATE_ADAPTER} from "../../../app/app.constant";
import {Module} from "../../../models/account/module";
import {Router} from "@angular/router";
import {OverlayContainer} from "@angular/cdk/overlay";
import {Title} from "@angular/platform-browser";
import {ChangePasswordDialogComponent} from "../../account/user/change-password-dialog/change-password-dialog.component";
import {DomService} from "../../../services/dom.service";
import {String} from "typescript-string-operations";
import {DialogContentReleaseComponent} from "../dialog-content-release/dialog-content-release.component";
import {ReleaseNotes} from "../../../models/release_notes";
import {ModulesDialogComponent} from "./modules-dialog/modules-dialog.component";


@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
    animations: [SIDENAV_EXPANDED, SIDENAV_CONTENT_EXPANDED],
    providers: [CUSTOM_DATE_ADAPTER]
})
export class MainComponent implements OnInit, OnDestroy, AfterContentChecked {

    private unsubscribe = new Subject();
    public module = "";
    public menu: MenuItem[] = [];
    public audio = new Audio();
    public isAlerting = false;
    public isExpanded = true;
    public title: string;
    public versionControl: string;
    public releases: ReleaseNotes[] = [];
    public count: number;
    public user: User;
    public modules: Module[] = [];
    toolbar: TemplateRef<any> | null = null;
    private _unsubscribe = new Subject();
    public iconModule = "";

    constructor(public titleService: Title,
                public variables: AppVariables,
                public authService: AuthService,
                public mainService: MainService,
                public translate: TranslateService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public location: Location,
                public router: Router,
                public overlayContainer: OverlayContainer,
                public domService: DomService,
                private cd: ChangeDetectorRef) {
        this.onChangeTitle();
        this.onChangeSnackBar();
        this.onPlaySound();
        this.onStopSound();
    }

    public ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.logout();
            return;
        }
        this.user = this.authService.user;
        this.isExpanded = window.screen.width > 1024;
        // this.loadVersion();
        this.loadModules();
        this.loadMenus();
        this.toolbarObserver();
    }

    public ngAfterContentChecked() {
        this.cd.detectChanges();
    }

    public ngOnDestroy() {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    // title page
    public onChangeTitle(): void {
        this.mainService.changeTitle.pipe(
            takeUntil(this.unsubscribe),
            distinctUntilChanged()
        ).subscribe(nextTitle => {
            this.title = nextTitle;
            this.titleService.setTitle("Nova" + " | " + this.translate._(this.title));
        });
    }

    // snack bar
    public onChangeSnackBar(): void {
        this.mainService.changeSnackBar.pipe(
            takeUntil(this.unsubscribe),
            distinctUntilChanged()
        ).subscribe(message => this.showSnackBar(message));
    }

    public showSnackBar(message: string) {
        this.snackBar.open(message, null, {
            duration: 5000,
            panelClass: "snack-bar"
        });
    }

    // resize screen
    public onResize(event): void {
        const windowWidth = event.target.innerWidth;
        this.isExpanded = windowWidth > 1024;
    }

    // sound alerts
    public onPlaySound(): void {
        this.mainService.play
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(sound => {
                this.audio.src = "assets/sounds/" + sound;
                this.audio.load();
                this.audio.play();
            });
    }

    public onStopSound(): void {
        this.mainService.stop
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.audio.pause();
            });
    }

    // notifications
    public onLoadNotification(count: number) {
        this.count = count;
        this.isAlerting = true;
        setTimeout(() => {
            this.isAlerting = false;
        }, 200);
    }

    public updateNotifications(sidenav: MatSidenav = null): void {
        this.mainService.changeNotification.next(undefined);
        if (sidenav) {
            sidenav.toggle();
        }
    }

    // account
    public openChangePasswordDialog(): void {
        // get data
        const data = {
            width: "500px",
            data: {
                user: this.user
            }
        };
        this.dialog.open(ChangePasswordDialogComponent, data).afterClosed()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe();
    }

    public openDialogReleaseNotes(): void {
        this.dialog.open(DialogContentReleaseComponent, {width: '70rem', height: '35rem', data: this.releases});
    }

    public loadModules(): void {
        this.module = this.authService.module.description;

        this.authService.loadModulesAllowed(this.user)
            .pipe(take(1))
            .subscribe(response => this.modules = response);
    }

    public loadMenus(): void {
        this.menu = [];
        this.authService.loadMenus(this.module)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(response => {
                if (response.routes && response.results) {
                    Object.assign(this.menu, response["results"]);
                }
            });
    }

    public logout(): void {
        this.authService.logout(true, true);
        // localStorage.clear();
    }

    public changeModule(module: Module) {
        this.authService.module = module;
        this.router.navigate(["/"])
            .then(() => {
                location.reload();
            });
    }

    public loadVersion() {
        this.authService.release.subscribe({
            next: (value: ReleaseNotes[]) => {
                this.releases = value;
                if (this.releases.length > 0) this.versionControl = this.releases[0].version_project;
            }
        });
    }

    // copyright
    get copyright(): string {
        return String.format(this.translate._("all-rights-reserved"), Utils.nowStr("YYYY"));
    }

    // system version
    get version(): string {
        if (this.versionControl)
            return String.format(this.translate._("system-version"), this.versionControl);
        return "";
    }

    toolbarObserver(): void {
        this.mainService.changeToolbar.pipe(
            takeUntil(this._unsubscribe),
            distinctUntilChanged()
        ).subscribe(toolbar => {
            this.toolbar = toolbar;
        });
    }


    public openModulesDialog() {
        const data = {
            panelClass: "modules-dialog",
            data: {
                close: close,
                modules: this.modules
            }
        };
        const dialogRef = this.dialog.open(ModulesDialogComponent, data);
        dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.changeModule(response);
            }
        });
    }
}
