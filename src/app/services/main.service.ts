import {Injectable, TemplateRef} from "@angular/core";
import {Subject} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Injectable()
export class MainService {

    public play = new Subject<string>();
    public stop = new Subject();
    public changeTitle = new Subject<string>();
    public changeNotification = new Subject<boolean>();
    public changeSnackBar = new Subject<string>();
    public changeToolbar = new Subject<TemplateRef<any>>();

    constructor(public spinner: NgxUiLoaderService) {
    }

    public startLoading(): void {
        this.spinner.start();
    }

    public stopLoading(): void {
        this.spinner.stop();
    }

    public setTitle(title: string): void {
        this.changeTitle.next(title);
    }

    public setToolbar(toolbar: TemplateRef<any>): void {
        this.changeToolbar.next(toolbar);
    }
}
