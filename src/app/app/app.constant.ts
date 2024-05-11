import {NgxUiLoaderConfig} from "ngx-ui-loader";
import {DateAdapter, MAT_DATE_FORMATS} from "@angular/material/core";
import {CustomDateAdapter} from "../utilities/custom-date-adapter";
import {WebpackTranslateLoader} from "../shared/translates/webpack-translate-loader";
import {TranslateLoader} from "@ngx-translate/core";

export const LOADER_OPTIONS: NgxUiLoaderConfig = {
    bgsColor: "#7D7D7D",
    bgsOpacity: 0.5,
    bgsPosition: "bottom-right",
    bgsSize: 80,
    bgsType: "three-bounce",
    blur: 5,
    fgsColor: "#7D7D7D",
    fgsPosition: "center-center",
    fgsSize: 80,
    fgsType: "three-bounce",
    gap: 24,
    logoPosition: "center-center",
    logoSize: 120,
    logoUrl: "",
    overlayBorderRadius: "0",
    overlayColor: "rgba(40, 40, 40, 0.8)",
    pbColor: "#7D7D7D",
    pbDirection: "ltr",
    pbThickness: 3,
    hasProgressBar: true,
    text: "",
    textColor: "#FFFFFF",
    textPosition: "center-center",
};

export const TOAST_OPTIONS = {
    positionClass: "toast-top-right",
    timeOut: 5000,
    progressBar: true,
    tapToDismiss: true,
    preventDuplicates: true,
};

export const CUSTOM_DATE_FORMAT = {
    parse: {
        dateInput: "L",
    },
    display: {
        dateInput: "L",
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY",
    },
};

export const CUSTOM_DATE_ADAPTER = [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT},
];

export const CUSTOM_MASKS = {
    DATE_BR: [/[0-3]/, /\d/, "/", /[0-1]/, /[0-9]/, "/", /[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
    DATE_EN: [/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/, "/", /[0-1]/, /[0-9]/, "/", /[0-3]/, /\d/],
    TIME: [/[0-2]/, /\d/, ":", /[0-5]/, /[0-9]/, ":", /[0-5]/, /[0-9]/],
    NUMBER: [/\d/],
    CPF: [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/],
    CEP: [/\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/],
    CNPJ: [/\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/],
    PHONE: ["(", /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
};

export const TRANSLATE_CONFIG = {
    loader: {provide: TranslateLoader, useClass: WebpackTranslateLoader}
};

