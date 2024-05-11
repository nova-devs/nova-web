import {BrowserModule} from "@angular/platform-browser";
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from "@angular/core";
import {HashLocationStrategy, LocationStrategy, NgOptimizedImage, registerLocaleData} from "@angular/common";
import localePt from "@angular/common/locales/pt";
import localeEn from "@angular/common/locales/en";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared.module";
import {LANGUAGE, LANGUAGES, TranslateService} from "./services/translate.service";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastService} from "./services/toast.service";
import {LOADER_OPTIONS, TOAST_OPTIONS, TRANSLATE_CONFIG} from "./app/app.constant";
import {AuthInterceptor} from "./utilities/auth.interceptor";
import {CustomPaginatorIntl} from "./utilities/custom-paginator-intl";
import {AppComponent} from "./app/app.component";
import {LoginComponent} from "./components/default/login/login.component";
import {PageNotfoundComponent} from "./components/default/page-notfound/page-notfound.component";
import {TranslateModule} from "@ngx-translate/core";
import {MainModule} from "./components/default/main/main.module";
import {AppVariables} from "./app/app.variables";
import {ToastrModule} from "ngx-toastr";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {RecoverPasswordComponent} from "./components/default/recover-password/recover-password.component";

import {AESEncryptDecryptService} from "./services/crypto.service";
import {DomService} from "./services/dom.service";
import {NgProgressModule} from "ngx-progressbar";
import {NgProgressHttpModule} from "ngx-progressbar/http";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {IConfig, provideEnvironmentNgxMask} from 'ngx-mask';
import {RouterModule} from "@angular/router";
import {ROUTES} from "./app.routing";
import {
    DialogContentReleaseComponent
} from "./components/default/dialog-content-release/dialog-content-release.component";
import {NgxPaginationModule} from "ngx-pagination";
import {CURRENCY_MASK_CONFIG, CurrencyMaskModule} from "ng2-currency-mask";
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter
} from "@angular/material-moment-adapter";

registerLocaleData(localePt, "pt-BR");
registerLocaleData(localeEn, "en-US");

const maskConfig: Partial<IConfig> = {
    validation: false,
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PageNotfoundComponent,
        RecoverPasswordComponent,
        DialogContentReleaseComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MainModule,
        NgxUiLoaderModule.forRoot(LOADER_OPTIONS),
        ToastrModule.forRoot(TOAST_OPTIONS),
        TranslateModule.forRoot(TRANSLATE_CONFIG),
        CurrencyMaskModule,
        SharedModule.forRoot(),
        RouterModule.forRoot(ROUTES),
        NgProgressModule,
        NgProgressHttpModule,
        MatCardModule,
        MatTableModule,
        MatIconModule,
        NgOptimizedImage,
        NgxPaginationModule
    ],
    providers: [
        AppVariables,
        ToastService,
        AESEncryptDecryptService,
        DomService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: CURRENCY_MASK_CONFIG,
            deps: [TranslateService],
            useFactory: (translate: TranslateService) => translate.getCurrencyConfig()
        },
        {
            provide: LOCALE_ID,
            deps: [TranslateService],
            useFactory: (translateService: TranslateService) => translateService.currentLang
        },
        {
            provide: MAT_DATE_LOCALE,
            deps: [TranslateService],
            useFactory: (translateService: TranslateService) => translateService.currentLang
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MAT_MOMENT_DATE_FORMATS
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {appearance: "outline"}
        },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {
            provide: MatPaginatorIntl,
            useClass: CustomPaginatorIntl,
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {hasBackdrop: true, position: {top: "5%"}, autoFocus: false}
        },
        provideEnvironmentNgxMask(maskConfig)
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(private _adapter: DateAdapter<any>,
                private _translate: TranslateService,
                private _matIconRegistry: MatIconRegistry) {
        this._adapter.setLocale(LANGUAGE.PT_BR);
        this._translate.addLangs(LANGUAGES);
        this._translate.setDefaultLang(LANGUAGE.PT_BR);
        this._translate.use(this._translate.currentLang);

        this._matIconRegistry.registerFontClassAlias("fas", "fas");
    }
}

