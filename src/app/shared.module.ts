import {ModuleWithProviders, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatDatepickerIntl, MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {MatRadioModule} from "@angular/material/radio";
import {MatSliderModule} from "@angular/material/slider";
import {MatSortModule} from "@angular/material/sort";
import {MatStepperModule} from "@angular/material/stepper";
import {MatToolbarModule} from "@angular/material/toolbar";
import {AuthService} from "./services/auth.service";
import {AppGuard} from "./app/app.guard";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTabsModule} from "@angular/material/tabs";
import {DialogComponent} from "./shared/dialog/dialog.component";
import {ValidatorDirective} from "./utilities/validator/validator.directive";
import {BlockUiComponent} from "./shared/block-ui/block-ui.component";
import {TranslateModule} from "@ngx-translate/core";
import {AutocompleteModule} from "./shared/autocomplete/autocomplete.module";
import {AutoFocusDirective} from "./utilities/auto-focus.directive";
import {DictToArrayPipe} from "./utilities/dict-to-iterable.pipe";
import {ChoicesPipe} from "./utilities/choices.pipe";
import {LocalDatePipe} from "./utilities/local-date.pipe";
import {DateFormatDirective} from "./utilities/date-format.directive";
import {LocalCurrencyPipe} from "./utilities/local-currency.pipe";
import {UppercaseDirective} from "./utilities/uppercase.directive";
import {EmptyValuePipe} from "./utilities/empty-value.pipe";
import {HistoryComponent} from "./components/default/history/history.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ChoicesDirective} from "./utilities/choices.directive";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RecoverService} from "./services/recover.service";
import {DebounceClickDirective} from "./utilities/debounce-click.directive";
import {AutocompleteOffDirective} from "./utilities/autocomplete-off.directive";
import {UserDialogComponent} from "./components/default/user/user-dialog.component";
import {ProgressComponent} from "./shared/progress/progress.component";
import {RemovewhitespacesPipe} from "./utilities/remove-spaces.pipe";
import {NgProgressModule} from "ngx-progressbar";
import {NgProgressHttpModule} from "ngx-progressbar/http";
import {HistoryNoModalComponent} from "./components/default/history-no-modal/history-no-modal.component";
import {RecordHistoryComponent} from "./components/default/record-history/record-history.component";
import {LowercaseDirective} from "./utilities/lowercase.directive";
import {FxGridGapDirective} from "./shared/fx/fx-grid-gap.directive";
import {FxFlexDirective} from "./shared/fx/fx-flex.directive";
import {FxLayoutDirective} from "./shared/fx/fx-layout.directive";
import {FxLayoutGapDirective} from "./shared/fx/fx-layout-gap.directive";
import {FxLayoutAlignDirective} from "./shared/fx/fx-layout-align.directive";
import {FxFillDirective} from "./shared/fx/fx-fill.directive";
import {FxGridDirective} from "./shared/fx/fx-grid.directive";

@NgModule({
    declarations: [
        AutoFocusDirective,
        ValidatorDirective,
        DateFormatDirective,
        UppercaseDirective,
        ChoicesDirective,
        DebounceClickDirective,
        AutocompleteOffDirective,
        DictToArrayPipe,
        EmptyValuePipe,
        ChoicesPipe,
        LocalDatePipe,
        LocalCurrencyPipe,
        BlockUiComponent,
        DialogComponent,
        HistoryComponent,
        UserDialogComponent,
        ProgressComponent,
        RemovewhitespacesPipe,
        HistoryNoModalComponent,
        RecordHistoryComponent,
        LowercaseDirective,
        FxFlexDirective,
        FxLayoutDirective,
        FxLayoutGapDirective,
        FxLayoutAlignDirective,
        FxFillDirective,
        FxGridDirective,
        FxGridGapDirective,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        AutocompleteModule,
        MatListModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatExpansionModule,
        MatMenuModule,
        MatTabsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatToolbarModule,
        MatChipsModule,
        MatSliderModule,
        MatStepperModule,
        MatRadioModule,
        DragDropModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        NgProgressModule,
        NgProgressHttpModule,
        MatChipsModule,
    ],
    exports: [
        AutoFocusDirective,
        ValidatorDirective,
        DateFormatDirective,
        UppercaseDirective,
        DebounceClickDirective,
        ChoicesDirective,
        AutocompleteOffDirective,
        DictToArrayPipe,
        EmptyValuePipe,
        ChoicesPipe,
        LocalDatePipe,
        LocalCurrencyPipe,
        BlockUiComponent,
        DialogComponent,
        HistoryComponent,
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        AutocompleteModule,
        MatListModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatExpansionModule,
        MatMenuModule,
        MatTabsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        MatToolbarModule,
        MatChipsModule,
        MatSliderModule,
        MatStepperModule,
        MatRadioModule,
        DragDropModule,
        MatCheckboxModule,
        ProgressComponent,
        RemovewhitespacesPipe,
        MatButtonToggleModule,
        NgProgressModule,
        NgProgressHttpModule,
        HistoryNoModalComponent,
        RecordHistoryComponent,
        CommonModule,
        LowercaseDirective,
        FxFlexDirective,
        FxLayoutDirective,
        FxLayoutGapDirective,
        FxLayoutAlignDirective,
        FxFillDirective,
        FxGridDirective,
        FxGridGapDirective,
    ],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AuthService,
                AppGuard,
                RecoverService,
                MatDatepickerIntl,
            ]
        };
    }
}
