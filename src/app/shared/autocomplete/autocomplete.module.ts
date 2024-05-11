import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {AutocompleteTriggerDirective} from "./autocomplete-trigger.directive";
import {AutocompleteComponent} from "./autocomplete.component";
import {AutocompleteControlComponent} from "./autocomplete-control.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatAutocompleteModule,
    ],
    declarations: [
        AutocompleteComponent,
        AutocompleteControlComponent,
        AutocompleteTriggerDirective,
    ],
    exports: [
        AutocompleteComponent,
        AutocompleteControlComponent,
        AutocompleteTriggerDirective,
    ]
})
export class AutocompleteModule {
}
