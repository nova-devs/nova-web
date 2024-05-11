import {Component, Injector, OnInit} from "@angular/core";
import {URLS} from "../../../../app/app.urls";
import {CustomValidators} from "../../../../utilities/validator/custom-validators";
import {User} from "../../../../models/account/user";
import {DialogComponent} from "../../../../shared/dialog/dialog.component";
import {take, takeUntil} from "rxjs/operators";
import {AuthService} from "../../../../services/auth.service";
import {BaseComponent, BaseOptions} from "../../../base.component";

const BASE_OPTIONS: BaseOptions = {
    endpoint: URLS.USER,
    nextRouteUpdate: "/account/user",
    retrieveOnInit: true,
    formTitle: "user",
    formRoute: "/account/user/"
};

@Component({
    selector: "app-model-item",
    templateUrl: "./user-item.component.html",
    styleUrls: ["./user-item.component.scss"]
})
export class UserItemComponent extends BaseComponent<User> implements OnInit {

    public object: User = new User();

    constructor(public injector: Injector,
                public authService: AuthService) {
        super(injector, BASE_OPTIONS);
    }

    public ngOnInit() {
        super.ngOnInit(() => {
            if (this.object.url) {
                this.f.username.disable();

                if (this.object.is_default) {
                    this.formGroup.disable();
                }
            }
        });
        this.getLoggedUser();
    }

    public createFormGroup(): void {
        this.formGroup = this.formBuilder.group({
            name: [null, CustomValidators.required],
            username: [null, CustomValidators.required],
            matriculation: [null],
            phone_number: [null],
            email: [null],
            isSuperuser: [{'value':false, 'disabled': this.authService.user.id === this.object.id}],
            isActive: [true],
        });
    }

    public resetPassword(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: "350px",
            data: {
                title: this.translate._("user"),
                message: this.translate._("password-reset-confirm"),
            }
        });

        dialogRef.afterClosed()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(result => {
                if (result) {
                    const data = {
                        new_password: "123456",
                        reset: true
                    };
                    this.service.patchFromDetailRoute(this.object.id, "change_password", data)
                        .pipe(takeUntil(this.unsubscribe))
                        .subscribe(() => {
                            this.toast.success("user", "new-password-for-user");
                        });
                }
            });
    }

    public saveOrUpdate(): void {
        super.saveOrUpdate(() => {
            this.f.username.disable();
        });
    }

    get loggedUserIsSuper(): boolean {
        if (this.authService.user) {
            return this.authService.user.is_superuser;
        }

        return false;
    }

    private getLoggedUser(): any {
        this.service.clearParameter();
        this.service.getById(this.authService.user.id)
            .pipe(take(1))
            .subscribe((response) => {
                this.authService.user.is_privileged_user = response.is_privileged_user;
            });
    }

    public canShowTabs(): boolean {
        return this.object.url && !(this.object.is_superuser || this.object.is_default);
    }
}
