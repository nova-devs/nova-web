import {Component, OnInit} from "@angular/core";
import {MainService} from "../../../services/main.service";
import {CustomValidators} from "../../../utilities/validator/custom-validators";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LANGUAGE, TranslateService} from "../../../services/translate.service";
import {DateAdapter} from "@angular/material/core";
import {Module} from "../../../models/account/module";
import {take} from "rxjs/operators";
import {ToastService} from "../../../services/toast.service";
import {User} from "../../../models/account/user";
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {DomService} from "../../../services/dom.service";
import {environment} from "../../../../environments/environment";
import * as CryptoJS from 'crypto-js';

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

    public formGroup: FormGroup;
    public url: string;
    public message: string;
    public en = LANGUAGE.EN_US;
    public pt = LANGUAGE.PT_BR;
    public modules: Module[] = [];
    private derived_key = CryptoJS.enc.Base64.parse("LefjQ2pEXmiy/nNZvEJ43i8hJuaAnzbA1Cbn1hOuAgA=");
    private iv = CryptoJS.enc.Utf8.parse("1020304050607080");

    constructor(public mainService: MainService,
                public authService: AuthService,
                public domService: DomService,
                public formBuilder: FormBuilder,
                public translate: TranslateService,
                public dateAdapter: DateAdapter<Date>,
                public route: ActivatedRoute,
                public router: Router,
                public toast: ToastService) {

    }

    public async ngOnInit() {
        this.createFormGroup();
        this.loadHomeModule();
        this.message = "sign-in";
        this.url = this.route.snapshot.queryParams["u"] || "/";
        this.domService.document.title = "Nova";

        this.route.queryParams.subscribe(params => {
            if (params.access && params.refresh) {
                this.azureAccess(params);
            }
        });
    }


    public azureAccess(params): void {
        this.authService.setToken(params, true);
        setTimeout(() => this.checkModulePermission(), 200);
        this.router.navigate([this.url]);
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            username: [null, CustomValidators.required],
            password: [null, CustomValidators.required],
            module: [null, CustomValidators.required],
        });
    }

    public login(): void {
        if (this.translate.currentLang == null) {
            this.translate.use(LANGUAGE.PT_BR);
        }
        const user = new User();
        user.username = CryptoJS.AES.encrypt(this.v.username, this.derived_key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC
        }).toString();
        user.password = CryptoJS.AES.encrypt(this.v.password, this.derived_key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC
        }).toString();

        this.message = "processing";
        this.authService.login(user)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.checkModulePermission();
                },
                error: () => {
                    this.message = "sign-in";
                    this.f.password.reset();
                }
            });
    }


    public checkModulePermission(): void {
        this.authService.canUseModule(this.v.module)
            .subscribe(response => {
                if (response.detail) {
                    this.authService.module = this.v.module;
                    this.router.navigate(["/"])
                        .then(() => location.reload());
                } else {
                    this.message = "sign-in";
                    this.toast.error("login", "you-are-not-allowed-to-use-module");
                }
            });
    }

    public loadHomeModule(): void {
        this.authService.loadModules({"is_active": true, "id": 1})
            .pipe(take(1))
            .subscribe(response => {
                this.modules = response;
                this.f.module.reset(this.modules[0]);
            });
    }

    private get f() {
        return this.formGroup.controls;
    }

    private get v() {
        return this.formGroup.value;
    }

    public changeLanguage(event: MatButtonToggleChange): void {
        const language = event.source.value;

        if (language){
            this.translate.use(language);
        }else {
            this.translate.use(LANGUAGE.PT_BR);
        }
        this.dateAdapter.setLocale(this.translate.currentLang);
    }

    public loginAzure(): void {
        window.open(environment.urlBase + '/accounts/login/?next=/home', '_self');
    }

}
