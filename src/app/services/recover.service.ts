import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {URLS} from "../app/app.urls";
import {User} from "../models/account/user";
import {MainService} from "./main.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";


@Injectable()
export class RecoverService {
    private readonly urlBase: string;
    private urlsRecover: string;

    constructor(public http: HttpClient,
                public mainService: MainService,
                public router: Router) {
        this.urlBase = environment.urlBase;
        this.urlsRecover = `${this.urlBase}${URLS.RECOVER}`;
    }

    public recoverPassword(user: User) {
        console.log(this.urlsRecover);
        return this.http.post(this.urlsRecover, user)
            .pipe(
                tap(() => {
                })
            );
    }
}
