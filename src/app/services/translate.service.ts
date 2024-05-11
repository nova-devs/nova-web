import {EventEmitter, Injectable} from '@angular/core';

import {TranslateService as NgxTranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {CurrencyMaskConfig} from "ng2-currency-mask";
import {LangChangeEvent} from "@ngx-translate/core/lib/translate.service";
import {StorageService} from "./storage.service";


export const LANGUAGE = {
    PT_BR: "pt-BR",
    EN_US: "en-US",
};
export const LANGUAGES = [LANGUAGE.PT_BR, LANGUAGE.EN_US];

@Injectable({
    providedIn: 'root',
})
export class TranslateService {

    constructor(private _storage: StorageService,
                private _translate: NgxTranslateService) {
    }

    get onLangChange(): EventEmitter<LangChangeEvent> {
        return this._translate.onLangChange;
    }

    get currentLang(): string {
        return this._translate.currentLang || this._storage.get("lang", LANGUAGE.PT_BR);
    }

    currentCultureLang(): string {
        return this._translate.getBrowserCultureLang();
    }

    _(key: string | Array<string>, interpolateParams?: object): string | any {
        return this._translate.instant(key, interpolateParams);
    }

    use(lang: string): Observable<any> {
        const _lang = LANGUAGES.includes(lang) ? lang : LANGUAGE.PT_BR;
        this._storage.set("lang", _lang);
        return this._translate.use(_lang);
    }

    getLangs(): Array<string> {
        return this._translate.getLangs();
    }

    addLangs(langs: Array<string>) {
        return this._translate.addLangs(langs);
    }

    setDefaultLang(lang: string): void {
        this._translate.setDefaultLang(lang);
    }

    getCurrencyConfig(): CurrencyMaskConfig {
        const config = {
            align: "right",
            allowNegative: true,
            prefix: "",
            suffix: "",
            thousands: "",
            decimal: ".",
            precision: 2,
        };
        switch (this.currentLang){
            case LANGUAGE.PT_BR:
                config["thousands"] = ".";
                config["decimal"] = ",";
                break;
            case LANGUAGE.EN_US:
                config["thousands"] = ",";
                config["decimal"] = ".";
                break;
        }

        return config;
    }
}
