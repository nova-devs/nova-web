import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {Moment} from "moment";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {

    createDate(year: number, month: number, date: number): Moment {
        return super.createDate(year, month, date);
    }

    format(date: Moment, displayFormat: string): string {
        return super.format(date, displayFormat);
    }

    parse(value: any, parseFormat: string | string[]): Moment | null {
        return super.parse(value, parseFormat);
    }

}
