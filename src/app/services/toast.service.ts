import {Injectable} from "@angular/core";
import {TranslateService} from "./translate.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ToastService {

    constructor(private _toast: ToastrService,
                private _translate: TranslateService) {
    }

    public success(title: string, content:  string): void {
        if (title) {
            this._toast.success(this._translate._(content), this._translate._(title));
        } else {
            this._toast.success(this._translate._(content));
        }
    }

    public error(title: string, content:  string): void {
        if (title) {
            this._toast.error(this._translate._(content), this._translate._(title));
        } else {
            this._toast.error(this._translate._(content));
        }
    }

    public warning(title: string, content:  string | Array<string> ): void {
        if (title) {
            this._toast.warning(this._translate._(content), this._translate._(title));
        } else {
            this._toast.warning(this._translate._(content));
        }
    }

    public info(title: string, content:  string): void {
        if (title) {
            this._toast.info(this._translate._(content), this._translate._(title));
        } else {
            this._toast.info(this._translate._(content));
        }
    }
}
