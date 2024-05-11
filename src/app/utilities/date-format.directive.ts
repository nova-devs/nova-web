import {Directive, Input, OnInit} from "@angular/core";
import {NgControl} from "@angular/forms";
import { MatDatepickerInput } from "@angular/material/datepicker";
import * as moment from "moment";

@Directive({
    selector: "input[dateFormat]",
})
export class DateFormatDirective implements OnInit {

    @Input() dateFormat = "YYYY-MM-DDTHH:mm:ssZ";

    constructor(public formControl: NgControl,
                public dateInput: MatDatepickerInput<Date>) {
    }

    public ngOnInit() {
        this.dateInput.dateChange.subscribe(element => {
            const date = element.value;
            if (date) {
                const dateStr = moment(date, "YYYY-MM-DDTHH:mm").format(this.dateFormat);
                this.formControl.control.setValue(dateStr);
            } else {
                this.formControl.control.reset();
            }
        });
    }
}
