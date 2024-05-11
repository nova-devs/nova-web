import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "dictToArray"
})
export class DictToArrayPipe implements PipeTransform {

    public transform(dict) {
        const array = [];
        Object.keys(dict).forEach(key => {
            array.push({value: key, text: dict[key]});
        });
        return array;
    }
}
