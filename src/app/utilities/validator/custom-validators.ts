import {AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import * as moment from "moment";

function isEmptyInputValue(value: any): boolean {
    return value == null || value.length === 0;
}

export class CustomValidators extends Validators {

    public static required(control: AbstractControl): ValidationErrors | null {
        try {
            return isEmptyInputValue(control.value) || !control.value.toString().match(/^(?!\s*$).+/g) ? {required: true} : null;
        } catch (e) {
            return isEmptyInputValue(control.value) ? {required: true} : null;
        }
    }

    public static contains(text: string): ValidatorFn | any {
        return (control: UntypedFormControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }

            if (control.value.toString().includes(text)) {
                return {invalid: true};
            }
            return null;
        };
    }

    public static nonContains(text: string): ValidatorFn | any {
        return (control: UntypedFormControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }

            if (!control.value.toString().includes(text)) {
                return {invalid: true};
            }
            return null;
        };
    }

    public static nonStartWithBlank(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return !control.value.match(/^(?! ).*$/) ? {nonStartWithBlank: true} : null;
    }

    public static nonHexaColor(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return !control.value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) ? {nonHexaColor: true} : null;
    }

    public static nonPositive(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return control.value < 0 ? {nonPositive: true} : null;
    }

    public static nonGtZero(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return control.value <= 0 ? {nonGtZero: true} : null;
    }

    public static nonGt(controlNameOrValue: number | string): ValidatorFn | any {
        return (control: UntypedFormControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            let target = null;

            if (typeof controlNameOrValue === "number") {
                target = controlNameOrValue;
            } else {
                target = control.root.get(controlNameOrValue).value;
            }

            if (target) {
                if (control.value > target) {
                    return {nonGt: true};
                }
            }
            return null;
        };
    }

    public static nonLt(controlNameOrValue: number | string): ValidatorFn | any {
        return (control: UntypedFormControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            let target = null;

            if (typeof controlNameOrValue === "number") {
                target = controlNameOrValue;
            } else {
                target = control.root.get(controlNameOrValue).value;
            }

            if (target) {
                if (control.value < target) {
                    return {nonLt: true};
                }
            }
            return null;
        };
    }

    public static timeNonGt(controlName: string): ValidatorFn | any {
        return (control: UntypedFormControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const closed_at = control.root.get(controlName);
            if (closed_at) {
                if (moment(control.value, "hh:mm:ss") > moment(closed_at.value, "hh:mm:ss")) {
                    return {startGreaterThanEndTime: true};
                }
            }
            return null;
        };
    }

    public static timeNonLt(controlName: string): ValidatorFn | any {
        return (control: UntypedFormControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const closed_at = control.root.get(controlName);
            if (closed_at) {
                if (moment(control.value, "hh:mm:ss") <= moment("00:00:00", "hh:mm:ss") && moment(closed_at.value, "hh:mm:ss") >= moment("23:00:00", "hh:mm:ss")) {
                    return null;
                } else if (moment(control.value, "hh:mm:ss") < moment(closed_at.value, "hh:mm:ss")) {
                    return {endLessThanStartTime: true};
                }
            }
            return null;
        };
    }

    public static nonTime(control: AbstractControl): ValidationErrors | null {
        const regex = "(?:[01]\\d|2[0-3]):(?:[0-5]\\d):(?:[0-5]\\d)";
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return !control.value.toString().match(regex) ? {nonTime: true} : null;
    }

    public static nonHost(control: AbstractControl): ValidationErrors | null {
        const regex = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return !control.value.toString().match(regex) ? {nonHost: true} : null;
    }

    public static nonNumber(control: AbstractControl): ValidationErrors | null {
        const regex = "^[0-9]+$";
        if (isEmptyInputValue(control.value)) {
            return null;
        }
        return !control.value.toString().match(regex) ? {invalid: true} : null;
    }

}
