import {Injectable, TemplateRef} from "@angular/core";
import {Subject} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Injectable({providedIn: "root"})
export class HomeService {

    changeTitle = new Subject<string>();
    changeToolbar = new Subject<TemplateRef<any>>();

    constructor(private _spinner: NgxUiLoaderService) {
    }

    startLoading(): void {
        this._spinner.start();
    }

    stopLoading(): void {
        this._spinner.stop();
    }

    setTitle(title: string): void {
        this.changeTitle.next(title);
    }

    setToolbar(toolbar: TemplateRef<any>): void {
        this.changeToolbar.next(toolbar);
    }
}
