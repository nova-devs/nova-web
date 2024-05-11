import {Directive, ElementRef} from "@angular/core";

@Directive({
    selector: `input[matInput]`,
})
export class AutocompleteOffDirective {
    constructor(el: ElementRef) {
        el.nativeElement.setAttribute("autocomplete", "off");
    }
}
