import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "emptyValue",
    pure: false
})
export class EmptyValuePipe implements PipeTransform {

    public transform(value: any, pattern = "-"): any {
        return value ? value : pattern;
    }
}
