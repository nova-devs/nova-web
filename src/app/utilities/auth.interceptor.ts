import {Injectable} from "@angular/core";
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs";


import {ToastService} from "../services/toast.service";
import {tap} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {TranslateService} from "../services/translate.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public toast: ToastService,
                public _translate: TranslateService,
                public authService: AuthService) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = this._addHeader(req);
        return next.handle(req)
            .pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        }, (errorResponse: HttpErrorResponse) => {
            this.handleError(errorResponse);
        }));
    }

    private handleError(err: HttpErrorResponse): void {
        const title = this._translate._(`http-error-${err.status}`);
        if (err.status === 0) {
            this.toast.error(title, "unknown-error");
            return;
        } else if (err.status === 401) {
            this.authService.logout(true);
            return;
        }

        const errors = AuthInterceptor.captureError(err.error);
        errors.forEach(t => {
            if (t instanceof Blob) {
                const reader = new FileReader();
                reader.addEventListener("loadend", () => {
                    this.showErrors(title, JSON.parse(reader.result.toString()));
                });
                reader.readAsText(t);
            } else {
                this.showErrors(title, t);
            }
        });
    }

    _addHeader(req: HttpRequest<any>) {
        return req.clone({
            setHeaders: {
                "Accept-Language": `${this._translate.currentLang}`
            }
        });
    }

    private showErrors(title, value: any): void {
        Object.keys(value).forEach((key: any) => {
            if (value[key] instanceof Array) {
                this.toast.error(title, value[key][0]);
            } else {
                this.toast.error(title, value[key]);
            }
        });
    }

    // Function to capture errors
    private static captureError(value: any): any[] {
        if (value instanceof Array) {
            return value;
        } else if (AuthInterceptor.isJson(value)) {
            return [value];
        }
        return [{detail: value}];
    }

    private static isJson(item) {
        item = typeof item !== "string" ? JSON.stringify(item) : item;
        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }
        return typeof item === "object" && item !== null;
    }
}
