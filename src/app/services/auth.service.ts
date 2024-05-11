import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams, HttpUserEvent} from "@angular/common/http";
import {catchError, shareReplay, tap} from "rxjs/operators";
import {URLS} from "../app/app.urls";
import {User} from "../models/account/user";
import {NavigationExtras, Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {from, Observable} from "rxjs";
import {DetailResponse} from "../dto/detail-response";
import {AppVariables} from "../app/app.variables";
import {MenuResponse} from "../dto/menu-response";
import {environment} from "../../environments/environment";
import {String} from "typescript-string-operations";
import {Module} from "../models/account/module";
import {AESEncryptDecryptService} from "./crypto.service";
import camelcaseKeys from "camelcase-keys";
import {ReleaseNotes} from "../models/release_notes";

interface AuthPayload {
    user_id: number;
    username: string;
    user: User;
    exp: number;
    orig_iat: number;
}

export interface AuthUser {
    token: string;
    user: User;
}

@Injectable()
export class AuthService {

    private storage = localStorage;
    private readonly urlBase: string;
    private readonly urlUser: string;
    private readonly urlToken: string;
    private urlMenu: string;
    private urlModule: string;
    private urlModuleMenu: string;
    public tokenKey: string;
    public moduleKey: string;

    constructor(public variables: AppVariables,
                public http: HttpClient,
                public router: Router,
                public CryptService: AESEncryptDecryptService) {
        this.urlBase = environment.urlBase;
        this.urlUser = `${this.urlBase}${URLS.USER}`;
        this.urlMenu = String.format("{0}{1}{2}", this.urlBase, URLS.MODULE_MENU, "find_menu/");
        this.urlToken = `${this.urlBase}${URLS.TOKEN}`;
        this.urlModule = `${this.urlBase}${URLS.MODULE}`;
        this.urlModuleMenu = `${this.urlBase}${URLS.MODULE_MENU}`;
        this.tokenKey = this.CryptService.encrypt("token");
        this.moduleKey = this.CryptService.encrypt("module");
    }

    get user(): User {
        if (!this.variables.user) {
            const token = this.storage.getItem(this.tokenKey);
            const payload = <AuthPayload>jwtDecode(token);
            const user = payload.user;
            user.url = this.urlBase.concat(user.url);
            this.variables.user = user;
        }
        return this.variables.user;
    }


    get release(): Observable<ReleaseNotes[]> {
        return this.http.get(this.urlBase + '/api/core/release_notes/releases/')
            .pipe(
                tap((response: any) => response as HttpUserEvent<ReleaseNotes[]>),
                catchError(() => from([]))
            );
    }

    set module(module: Module) {
        if (this.storage) {
            this.getModuleKey();
            this.storage.setItem(this.moduleKey, this.CryptService.encrypt(JSON.stringify(module)));
        }
    }


    get module(): Module {
        if (this.getModuleKey()) {
            const value = this.storage.getItem(this.moduleKey);
            return JSON.parse(this.CryptService.decrypt(value));
        }
        return null;
    }

    private getModuleKey() {
        let isModuleKey = false;
        Object.keys(localStorage).forEach(key => {
            if (this.CryptService.decrypt(key) === "module") {
                this.moduleKey = key;
                isModuleKey = true;
                return;
            }
        });
        return isModuleKey;
    }

    get theme(): string {
        return "this.getPrefs";
        // return this.getPrefs("theme");
    }

    public authentic(user: User) {
        return this.http.post(this.urlToken, user);
    }

    public login(user: User) {
        return this.authentic(user)
            .pipe(
                tap(response => this.setToken(response)),
                shareReplay(),
            );
    }

    public logout(reload?: boolean, redirect?: boolean, extras?: NavigationExtras): void {
        this.clearCached();
        if (reload) {
            location.reload();
        }
        if (redirect) {
            this.router.navigate(["login"], extras).then();
        }
    }

    public isLoggedIn(): boolean {
        let isLogged = false;
        Object.keys(localStorage).forEach(key => {
            if (this.CryptService.decrypt(key) === "token") {
                this.tokenKey = key;
                isLogged = true;
                return;
            }
        });
        return isLogged;
    }

    private clearCached(): void {
        this.storage.removeItem(this.tokenKey);
        this.storage.removeItem(this.moduleKey);
    }

    public changePassword(user: User, data): Observable<DetailResponse> {
        const headers = new HttpHeaders({
            "Authorization": "Bearer ".concat(this.storage.getItem(this.tokenKey)),
        });

        const url = `${this.urlUser}${user.id}/change_password/`;
        return this.http.patch<DetailResponse>(url, data, {"headers": headers});
    }

    public setToken(authResponse, azureLogin = false) {
        if (azureLogin) {
            this.storage.setItem(this.tokenKey, authResponse.access);
            return;
        }
        if (authResponse) {
            this.storage.setItem(this.tokenKey, authResponse.token.access);
        }
    }

    public canUseModule(module: Module): Observable<DetailResponse> {
        const headers = new HttpHeaders({
            "Authorization": "Bearer ".concat(this.storage.getItem(this.tokenKey)),
        });
        const params = new HttpParams({
            fromObject: {"permission_name": "account.load_module"}
        });
        const options = {"headers": headers, "params": params};

        return this.http.get(`${this.urlModule}${module.id}/has_permission/`, options)
            .pipe(
                tap((response: any) => response as HttpUserEvent<DetailResponse>),
                catchError(() => from([]))
            );
    }

    public loadModules(query_params?: { is_active: boolean; id: number; }): Observable<Module[]> {
        const params = new HttpParams({fromObject: query_params});
        return this.http.get(`${this.urlModule}`, {params: params})
            .pipe(
                tap((response: any) => response as HttpUserEvent<Module[]>),
                catchError(() => from([]))
            );
    }

    public loadModulesAllowed(user: User): Observable<Module[]> {
        const headers = new HttpHeaders({
            "Authorization": "Bearer ".concat(this.storage.getItem(this.tokenKey)),
        });
        const params = new HttpParams({
            fromObject: {
                "user": user.id.toString(),
                "granted": "true",
                "is_active": "true",
                "ordering": "id"
            }
        });
        const options = {"headers": headers, "params": params};

        return this.http.get(`${this.urlModule}with_granted/`, options)
            .pipe(
                tap((response: any) => response as HttpUserEvent<Module[]>),
                catchError(() => from([]))
            );
    }

    public loadMenus(module: string): Observable<MenuResponse> {
        const params = new HttpParams({
            fromObject: {"user": this.user.id.toString(), "module": module}
        });

        return this.http.get(`${this.urlModuleMenu}find_menu/`, {params: params})
            .pipe(
                tap((response: any) => response as HttpUserEvent<MenuResponse>),
                catchError(() => from([]))
            );
    }

}
