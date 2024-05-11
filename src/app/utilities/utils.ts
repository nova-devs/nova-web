import * as moment from "moment";
import {Moment} from "moment";
import {SafeUrl} from "@angular/platform-browser";
import {AbstractControl} from "@angular/forms";
import {PaginatedResult} from "../dto/paginated-result";

export class Utils {

    public static onlyNumber(value: any): any {
        return value.replace(/\D/g, "");
    }

    public static convertBase64ToImage(base64: string | Blob): string {
        return base64 ? "data:image/png;base64," + base64 : null;
    }

    public static convertBase64ToBlob(data: SafeUrl, type: string) {
        // convert base64 to raw binary data held in a string
        const byteString = atob(data.toString().split(",")[1]);

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], {type: type});
    }

    public static downloadFileFromBlob(file: Blob, filename: string): any {
        const fileUrl = (window.URL || window["webkitURL"]).createObjectURL(file);
        const anchor = document.createElement("a");
        anchor.download = filename;
        anchor.href = fileUrl;
        anchor.dispatchEvent(
            new MouseEvent("click", {bubbles: true, cancelable: true, view: window})
        );
        anchor.remove();
    }

    public static normalize(str: string): string {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    public static nowStr(format = "YYYY-MM-DD HH:mm:ssZ"): string {
        return moment().format(format);
    }

    public static momentStr(date: any, format = "YYYY-MM-DD HH:mm:ssZ"): string {
        return moment(date).format(format);
    }

    public static isDate(value: any) {
        if (toString.call(value) === "[object Date]") {
            return true;
        }
        if (typeof value.replace === "function") {
            value.replace(/^\s+|\s+$/gm, "");
        }
        const dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4}).+?$/;
        return dateFormat.test(value);
    }

    public static formatHour(totalSeconds: number) {
        function pad(value: number) {
            const _value = value ? value : 0;
            return _value.toString().padStart(2, "0");
        }

        const totalMinutes = Math.trunc(totalSeconds / 60);
        const seconds = Math.trunc((totalSeconds - (totalMinutes * 60)));
        const hours = Math.trunc(totalMinutes / 60);
        const minutes = Math.trunc(totalMinutes - (hours * 60));

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    public static activeFirstElement(elements: PaginatedResult<any>, field: string, control: AbstractControl, single = true): void {
        if (elements && elements.count > 0) {
            if (single && elements.count > 1) {
                return;
            }
            control.patchValue(elements.results[0][field]);
        }
    }

    public static stringTimeToSeconds(time: string): number {
        const dateString = "2018-01-01T";
        const x = new Date(dateString + time);
        let totalSeconds = x.getSeconds();
        totalSeconds += x.getMinutes() * 60;
        totalSeconds += x.getHours() * 3600;

        return totalSeconds;
    }

    public static convertTotalSecondsToTime(total: number): string {
        const seconds: any = (total % 60);
        const totalMinutes: any = ((total - seconds) / 60);
        const minutes: any = (totalMinutes % 60);
        const hours: any = ((totalMinutes - minutes) / 60);
        return (hours > 9 ? hours : "0" + hours) +
            ":" + (minutes > 9 ? minutes : "0" + minutes) +
            ":" + (seconds > 9 ? Math.round(seconds) : "0" + Math.round(seconds));
    }

    public static getDayAndMonthByDateString(date: string): string {
        return moment(date, "YYYY-MM-DD").format("DD/MM");
    }

    public static getDateFromStringDate(date: string): Moment {
        return moment(date, "YYYY-MM-DD");
    }

    public addYears(date: moment.Moment, years: number): moment.Moment {
        return moment(date).add(years, "years");
    }

    public static isNull(value: any): boolean {
        return value === "" || value === undefined || value === null || value.length === 0;
    }

}
