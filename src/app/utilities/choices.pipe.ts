import {Pipe, PipeTransform} from "@angular/core";
import {Choice} from "../dto/choice";

@Pipe({
    name: "choices"
})
export class ChoicesPipe implements PipeTransform {

    public transform(value: any, choices: Choice[]) {
        const filters = choices.filter(t => t.value === value);
        const choice = filters.pop();
        return choice ? choice.display_name : "-";
    }
}
