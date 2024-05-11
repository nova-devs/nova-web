/**
 * Created by: Wendel Silva
 * Copy from: MatAutocompleteTrigger
 */

import {Directionality} from "@angular/cdk/bidi";
import {DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, RIGHT_ARROW, TAB, UP_ARROW} from "@angular/cdk/keycodes";
import {
    ConnectedPosition,
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayConfig,
    OverlayRef,
    PositionStrategy,
    ScrollStrategy
} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";
import {DOCUMENT} from "@angular/common";
import {delay, filter, map, switchMap, take, tap} from "rxjs/operators";
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    forwardRef,
    Host,
    HostListener,
    Inject,
    InjectionToken,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    SimpleChanges,
    ViewContainerRef,
} from "@angular/core";
import {ViewportRuler} from "@angular/cdk/scrolling";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {
    _countGroupLabelsBeforeOption,
    _getOptionScrollPosition,
    MatOption,
    MatOptionSelectionChange
} from "@angular/material/core";
import {MatFormField} from "@angular/material/form-field";
import {defer, fromEvent, merge, Observable, of as observableOf, Subject, Subscription} from "rxjs";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {AutocompleteComponent} from "./autocomplete.component";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AESEncryptDecryptService} from "../../services/crypto.service";

/** The height of each appAutocomplete option. */
export const AUTOCOMPLETE_OPTION_HEIGHT = 48;

/** The total height of the appAutocomplete panel. */
export const AUTOCOMPLETE_PANEL_HEIGHT = 256;

/** Injection token that determines the scroll handling while the appAutocomplete panel is open. */
export const AUTOCOMPLETE_SCROLL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>("mat-appAutocomplete-scroll-strategy");

/** Export token that needs to providers */
export function APP_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
    return () => overlay.scrollStrategies.reposition();
}

/** Export scroll strategy of auto complete */
export const AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: AUTOCOMPLETE_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: APP_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY,
};

export const emptyFn = () => {
};

/** Provider that allows the appAutocomplete to register as a ControlValueAccessor. */
export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutocompleteTriggerDirective),
    multi: true
};

/** Creates an error to be thrown when attempting to use an appAutocomplete trigger without a panel. */
export function getAppAutocompleteMissingPanelError(): Error {
    return Error("Attempting to open an undefined instance of `app-appAutocomplete`. " +
        "Make sure that the id passed to the `appAutocomplete` is correct and that " +
        "you're attempting to open it after the ngAfterContentInit hook.");
}

/* eslint-disable */
@Directive({
    selector: `input[appAutocomplete]`,
    host: {
        "[attr.autocomplete]": "autocompleteAttribute",
        "[attr.role]": "autocompleteDisabled ? null : \"combobox\"",
        "[attr.aria-autocomplete]": "autocompleteDisabled ? null : \"list\"",
        "[attr.aria-activedescendant]": "(panelOpen && activeOption) ? activeOption.id : null",
        "[attr.aria-expanded]": "autocompleteDisabled ? null : panelOpen.toString()",
        "[attr.aria-owns]": "(autocompleteDisabled || !panelOpen) ? null : appAutocomplete?.matAutocomplete?.id",
        "[attr.aria-haspopup]": "!autocompleteDisabled",
        // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
        // a little earlier. This avoids issues where IE delays the focusing of the input.
        "(focusin)": "_handleFocus()",
        "(blur)": "_onTouched()",
        // "(input)": "_handleInput($event)",
        // "(keydown)": "_handleKeydown($event)",
    },
    exportAs: "appAutocompleteTrigger",
    providers: [AUTOCOMPLETE_VALUE_ACCESSOR, AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class AutocompleteTriggerDirective implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    private _overlayRef: OverlayRef | null;
    private _portal: TemplatePortal;
    private _componentDestroyed = false;
    private _autocompleteDisabled = false;
    private readonly _scrollStrategy: () => ScrollStrategy;

    /** Old value of the native input. Used to work around issues with the `input` event on IE. */
    private _previousValue: string | number | null;

    /** Strategy that is used to position the panel. */
    private _positionStrategy: FlexibleConnectedPositionStrategy;

    /** Whether or not the label state is being overridden. */
    private _manuallyFloatingLabel = false;

    /** The subscription for closing actions (some are bound to document). */
    private _closingActionsSubscription: Subscription;

    /** Subscription to viewport size changes. */
    private _viewportSubscription = Subscription.EMPTY;

    /**
     * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
     * closed autocomplete from being reopened if the user switches to another browser tab and then
     * comes back.
     */
    private _canOpenOnNextFocus = true;

    /** Stream of keyboard events that can close the panel. */
    private readonly _closeKeyEventStream = new Subject<void>();

    /**
     * Event handler for when the window is blurred. Needs to be an
     * arrow function in order to preserve the context.
     */
    private _windowBlurHandler = () => {
        // If the user blurred the window while the autocomplete is focused, it means that it'll be
        // refocused when they come back. In this case we want to skip the first focus event, if the
        // pane was closed, in order to avoid reopening it unintentionally.
        this._canOpenOnNextFocus = this._document.activeElement !== this._element.nativeElement || this.panelOpen;
        // tslint:disable-next-line:semicolon
    };

    /** `View -> model callback called when value changes` */
    private _onChange: (value: any) => void = emptyFn;

    /** `View -> model callback called when autocomplete has been touched` */
    private _onTouched = emptyFn;

    /** The appAutocomplete panel to be attached to this trigger. */
    @Input() appAutocomplete: AutocompleteComponent;

    /**
     * Position of the autocomplete panel relative to the trigger element. A position of `auto`
     * will render the panel underneath the trigger if there is enough space for it to fit in
     * the viewport, otherwise the panel will be shown above it. If the position is set to
     * `above` or `below`, the panel will always be shown above or below the trigger. no matter
     * whether it fits completely in the viewport.
     */
        // tslint:disable-next-line:no-input-rename
    @Input("appAutocompletePosition") position: "auto" | "above" | "below" = "auto";


    /**
     * `autocomplete` attribute to be set on the input element.
     * @docs-private
     */
    @Input("autocomplete") autocompleteAttribute = "off";
    /**
     * Whether the autocomplete is disabled. When disabled, the element will
     * act as a regular input and the user won't be able to open the panel.
     */
    @Input("appAutocompleteDisabled")
    get autocompleteDisabled(): boolean {
        return this._autocompleteDisabled;
    }

    set autocompleteDisabled(value: boolean) {
        this._autocompleteDisabled = coerceBooleanProperty(value);
    }

    private token: string;
    public tokenKey: string;

    constructor(private _element: ElementRef<HTMLInputElement>,
                private _overlay: Overlay,
                private _viewContainerRef: ViewContainerRef,
                private _zone: NgZone,
                private _changeDetectorRef: ChangeDetectorRef,
                private _http: HttpClient,
                @Inject(AUTOCOMPLETE_SCROLL_STRATEGY) scrollStrategy: any,
                @Optional() private _dir: Directionality,
                @Optional() @Host() private _formField: MatFormField,
                @Optional() @Inject(DOCUMENT) private _document: any,
                // @breaking-change 8.0.0 Make `_viewportRuler` required.
                private _viewportRuler?: ViewportRuler,
                public CryptService?: AESEncryptDecryptService) {

        _formField._elementRef.nativeElement.style = "width: 100%";

        if (typeof window !== "undefined") {
            _zone.runOutsideAngular(() => {
                window.addEventListener("blur", this._windowBlurHandler);
            });
        }

        this._scrollStrategy = scrollStrategy;

    }

    ngOnInit() {
        this.appAutocomplete._reset = this._reset.bind(this);
        this.appAutocomplete._disabled = !this._canOpen();
        this.tokenKey = this.getTokenKey();
        this.token = localStorage.getItem(this.tokenKey);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["position"] && this._positionStrategy) {
            this._setStrategyPositions(this._positionStrategy);

            if (this.panelOpen) {
                // tslint:disable-next-line:no-non-null-assertion
                this._overlayRef!.updatePosition();
            }
        }
    }

    ngOnDestroy() {
        if (typeof window !== "undefined") {
            window.removeEventListener("blur", this._windowBlurHandler);
        }

        this._viewportSubscription.unsubscribe();
        this._componentDestroyed = true;
        this._destroyPanel();
        this._closeKeyEventStream.complete();
    }

    /** Whether or not the autocomplete panel is open. */
    get panelOpen(): boolean {
        return this._overlayAttached && this.appAutocomplete.matAutocomplete.showPanel;
    }

    private _overlayAttached = false;

    /** Opens the autocomplete suggestion panel. */
    openPanel(): void {
        this._attachOverlay();
        this._floatLabel();
    }

    /** Closes the autocomplete suggestion panel. */
    closePanel(): void {
        this._resetLabel();

        if (!this._overlayAttached) {
            return;
        }

        if (this.panelOpen) {
            // Only emit if the panel was visible.
            this.appAutocomplete.matAutocomplete.closed.emit();
        }

        this.appAutocomplete.matAutocomplete._isOpen = this._overlayAttached = false;

        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._closingActionsSubscription.unsubscribe();
        }

        // Note that in some cases this can end up being called after the component is destroyed.
        // Add a check to ensure that we don't try to run change detection on a destroyed view.
        if (!this._componentDestroyed) {
            // We need to trigger change detection manually, because
            // `fromEvent` doesn't seem to do it at the proper time.
            // This ensures that the label is reset when the
            // user clicks outside.
            this._changeDetectorRef.detectChanges();
        }
    }

    /**
     * Updates the position of the autocomplete suggestion panel to ensure that it fits all options
     * within the viewport.
     */
    updatePosition(): void {
        if (this._overlayAttached) {
            // tslint:disable-next-line:no-non-null-assertion
            this._overlayRef!.updatePosition();
        }
    }

    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     */
    get panelClosingActions(): Observable<MatOptionSelectionChange | null> {
        return merge(
            this.optionSelections,
            this.appAutocomplete.matAutocomplete._keyManager.tabOut.pipe(filter(() => this._overlayAttached)),
            this._closeKeyEventStream,
            this._getOutsideClickStream(),
            this._overlayRef ?
                this._overlayRef.detachments().pipe(filter(() => this._overlayAttached)) :
                observableOf()
        ).pipe(
            // Normalize the output so we return a consistent type.
            map(event => event instanceof MatOptionSelectionChange ? event : null)
        );
    }

    /** Stream of autocomplete option selections. */
    private readonly optionSelections: Observable<MatOptionSelectionChange> = defer(() => {
        if (this.appAutocomplete.matAutocomplete && this.appAutocomplete.matAutocomplete.options) {
            return merge(...this.appAutocomplete.matAutocomplete.options.map(option => option.onSelectionChange));
        }

        // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
        // Return a stream that we'll replace with the real one once everything is in place.
        return this._zone.onStable
            .asObservable()
            .pipe(take(1), switchMap(() => this.optionSelections));
    }) as Observable<MatOptionSelectionChange>;

    /** The currently active option, coerced to MatOption type. */
    get activeOption(): MatOption | null {
        if (this.appAutocomplete.matAutocomplete && this.appAutocomplete.matAutocomplete._keyManager) {
            return this.appAutocomplete.matAutocomplete._keyManager.activeItem;
        }

        return null;
    }

    /** Stream of clicks outside of the autocomplete panel. */
    private _getOutsideClickStream(): Observable<any> {
        return merge(
            fromEvent(this._document, "click") as Observable<MouseEvent>,
            fromEvent(this._document, "touchend") as Observable<TouchEvent>
        )
            .pipe(filter(event => {
                const clickTarget = event.target as HTMLElement;
                const formField = this._formField ?
                    this._formField._elementRef.nativeElement : null;

                return this._overlayAttached &&
                    clickTarget !== this._element.nativeElement &&
                    (!formField || !formField.contains(clickTarget)) &&
                    (!!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget));
            }));
    }


    // Implemented as part of ControlValueAccessor.
    writeValue(value: any): void {
        try {
            if (!value) {
                this._resetItem();
                this._resetValue();
                return;
            }
            if (!value.toString().startsWith(location.protocol)) {
                this._resetValue(value);
                return;
            }
            this._retrieveValue(value);
        } catch (e) {
            this._resetValue();
        }
    }

    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn: (value: any) => {}): void {
        this._onChange = fn;
    }

    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn: () => {}) {
        this._onTouched = fn;
    }

    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled: boolean) {
        this.appAutocomplete._disabled = isDisabled;
        this._element.nativeElement.disabled = isDisabled;
    }

    @HostListener("keydown", ["$event"])
    _handleKeydown(event: KeyboardEvent): void {
        const keyCode = Number(event.code);

        // Prevent the default action on all escape key presses. This is here primarily to bring IE
        // in line with other browsers. By default, pressing escape on IE will cause it to revert
        // the input value to the one that it had on focus, however it won't dispatch any events
        // which means that the model value will be out of sync with the view.
        if (keyCode === ESCAPE) {
            event.preventDefault();
        }

        if (this.activeOption && keyCode === ENTER && this.panelOpen) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        } else if ((keyCode === LEFT_ARROW && event.ctrlKey) && this.panelOpen) {
            this._onPaginationEvent(false);
        } else if ((keyCode === RIGHT_ARROW && event.ctrlKey) && this.panelOpen) {
            this._onPaginationEvent(true);
        } else if (this.appAutocomplete.matAutocomplete) {
            const prevActiveItem = this.appAutocomplete.matAutocomplete._keyManager.activeItem;
            const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

            if (this.panelOpen || keyCode === TAB) {
                this.appAutocomplete.matAutocomplete._keyManager.onKeydown(event);
            } else if (isArrowKey && this._canOpen()) {
                this.openPanel();
            }

            if (isArrowKey || this.appAutocomplete.matAutocomplete._keyManager.activeItem !== prevActiveItem) {
                this._scrollToOption();
            }
        }
    }

    @HostListener("input", ["$event"])
    _handleInput(event: KeyboardEvent): void {
        const target = event.target as HTMLInputElement;
        let value: number | string | null = target.value;

        // Based on `NumberValueAccessor` from forms.
        if (target.type === "number") {
            value = value === "" ? null : parseFloat(value);
        }

        // If the input has a placeholder, IE will fire the `input` event on page load,
        // focus and blur, in addition to when the user actually changed the value. To
        // filter out all of the extra events, we save the value on focus and between
        // `input` events, and we check whether it changed.
        // See: https://connect.microsoft.com/IE/feedback/details/885747/
        if (this._previousValue !== value) {
            this._previousValue = value;
            this._onFilterEvent(value.toString());

            if (this._canOpen() && this._document.activeElement === event.target) {
                this.openPanel();
            }
        } else if (value === "") {
            this._onFilterEvent("");
        }
    }

    _handleFocus(): void {
        if (!this._canOpenOnNextFocus) {
            this._canOpenOnNextFocus = true;
        } else if (this._canOpen()) {
            this._previousValue = this._element.nativeElement.value;
            this._attachOverlay();
            this._floatLabel(true);
        }
    }

    /**
     * In "auto" mode, the label will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the label until the panel can be closed.
     * @param shouldAnimate Whether the label should be animated when it is floated.
     */
    private _floatLabel(shouldAnimate = false): void {
        if (this._formField && this._formField.floatLabel === "auto") {
            if (shouldAnimate) {
                this._formField._animateAndLockLabel();
            } else {
                this._formField.floatLabel = "always";
            }

            this._manuallyFloatingLabel = true;
        }
    }

    /** If the label has been manually elevated, return it to its normal state. */
    private _resetLabel(): void {
        if (this._manuallyFloatingLabel) {
            this._formField.floatLabel = "auto";
            this._manuallyFloatingLabel = false;
        }
    }

    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     */
    private _scrollToOption(): void {
        const index = this.appAutocomplete.matAutocomplete._keyManager.activeItemIndex || 0;
        const labelCount = _countGroupLabelsBeforeOption(index,
            this.appAutocomplete.matAutocomplete.options, this.appAutocomplete.matAutocomplete.optionGroups);

        const newScrollPosition = _getOptionScrollPosition(
            index + labelCount,
            AUTOCOMPLETE_OPTION_HEIGHT,
            this.appAutocomplete.matAutocomplete._getScrollTop(),
            AUTOCOMPLETE_PANEL_HEIGHT
        );

        this.appAutocomplete.matAutocomplete._setScrollTop(newScrollPosition);
    }

    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     */
    private _subscribeToClosingActions(): Subscription {
        const firstStable = this._zone.onStable.asObservable().pipe(take(1));
        const optionChanges = this.appAutocomplete.matAutocomplete.options.changes.pipe(
            tap(() => this._positionStrategy.reapplyLastPosition()),
            // Defer emitting to the stream until the next tick, because changing
            // bindings in here will cause "changed after checked" errors.
            delay(0)
        );

        // When the zone is stable initially, and when the option list changes...
        return merge(firstStable, optionChanges)
            .pipe(
                // create a new stream of panelClosingActions, replacing any previous streams
                // that were created, and flatten it so our stream only emits closing events...
                switchMap(() => {
                    const wasOpen = this.panelOpen;
                    this._resetActiveItem();
                    this.appAutocomplete.matAutocomplete._setVisibility();

                    if (this.panelOpen) {
                        // tslint:disable-next-line:no-non-null-assertion
                        this._overlayRef!.updatePosition();

                        // If the `panelOpen` state changed, we need to make sure to emit the `opened`
                        // event, because we may not have emitted it when the panel was attached. This
                        // can happen if the users opens the panel and there are no options, but the
                        // options come in slightly later or as a result of the value changing.
                        if (wasOpen !== this.panelOpen) {
                            this.appAutocomplete.matAutocomplete.opened.emit();
                        }
                    }

                    return this.panelClosingActions;
                }),
                // when the first closing event occurs...
                take(1))
            // set the value, close the panel, and complete.
            .subscribe(event => this._setValueAndClose(event));
    }

    /** Destroys the autocomplete suggestion panel. */
    private _destroyPanel(): void {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }

    /** Auto complete formControl methods. */
    private _reset(all: boolean) {
        this._resetValue();
        this._resetItem();

        if (all) {
            this._resetFilter();
            this._element.nativeElement.focus();
        }
    }

    private _resetFilter(): void {
        this.appAutocomplete._searchEvent.next("");
    }

    private _onFilterEvent(text: string): void {
        this._resetItem();
        this.appAutocomplete._searchEvent.next(text);
    }

    private _onPaginationEvent(nextPage: boolean): void {
        this.appAutocomplete._paginationEvent.next(nextPage);
    }

    private _resetItem(): void {
        this.appAutocomplete.item = {};
        this.appAutocomplete.selectedItemEvent.next({});
        this._onChange("");
    }

    private _resetValue(value: string = ""): void {
        setTimeout(() => {
            this._setTriggerValue(value);
        }, 0)
    }

    private _setSelectedItem(item: any): void {
        if (this._canWriteItem(item)) {
            this._writeItem(item);
            this._onChange(item[this.appAutocomplete.id]);
        }
    }

    private _writeItem(item: any): void {
        if (this._canWriteItem(item)) {
            this.appAutocomplete.item = item;
            this.appAutocomplete._searching = false;
            this.appAutocomplete.selectedItemEvent.next(item);
        }
    }

    private _canWriteItem(item: any): boolean {
        if (item instanceof Object && item[this.appAutocomplete.id]) {
            return !(this.appAutocomplete.item[this.appAutocomplete.id]
                && this.appAutocomplete.item[this.appAutocomplete.id] === item[this.appAutocomplete.id]);

        }
        return false;
    }

    private getTokenKey(): string {
        let tokenKey = "";
        Object.keys(localStorage).forEach(key => {
            if (this.CryptService.decrypt(key) === "token") {
                tokenKey = key;
                return;
            }
        });
        return tokenKey;
    }

    private _retrieveValue(value: any): void {
        const pObject = {};
        if (this.appAutocomplete.expands.length > 0) {
            pObject["expand"] = this.appAutocomplete.expands.join(",");
        }
        this.token = localStorage.getItem(this.tokenKey);
        const headers = new HttpHeaders({
            "Authorization": "Bearer ".concat(this.token)
        });
        const params = new HttpParams({
            fromObject: pObject
        });
        this._http.get(value, {"headers": headers, "params": params}).pipe(
            take(1),
            tap(response => this._writeItem(response)),
            delay(100)
        ).subscribe(response => {
            this._setTriggerValue(response);
            this._onChange(response[this.appAutocomplete.id]);
        });
    }

    private _setTriggerValue(value: any): void {
        let toDisplay = "";
        if (value instanceof Object) {
            const autocomplete = this.appAutocomplete.matAutocomplete;
            toDisplay = autocomplete && autocomplete.displayWith ? autocomplete.displayWith(value) : value;
        } else {
            toDisplay = value;
        }

        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        const inputValue = toDisplay != null ? toDisplay : "";

        // If it's used within a `MatFormField`, we should set it through the property so it can go
        // through change detection.
        if (this._formField) {
            this._formField._control.value = inputValue;
        } else {
            this._element.nativeElement.value = inputValue;
        }

        this._previousValue = inputValue;
    }

    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     */
    private _setValueAndClose(event: MatOptionSelectionChange | null): void {
        if (event && event.source) {
            this._clearPreviousSelectedOption(event.source);
            this._setTriggerValue(event.source.value);
            this._setSelectedItem(event.source.value);

            this._element.nativeElement.focus();
            this.appAutocomplete.matAutocomplete._emitSelectEvent(event.source);
        }

        this.closePanel();
    }

    /**
     * Clear any previous selected option and emit a selection change event for this option
     */
    private _clearPreviousSelectedOption(skip: MatOption) {
        this.appAutocomplete.matAutocomplete.options.forEach(option => {
            if (option !== skip && option.selected) {
                option.deselect();
            }
        });
    }

    private _attachOverlay(): void {
        if (!this.appAutocomplete.matAutocomplete) {
            throw getAppAutocompleteMissingPanelError();
        }

        let overlayRef = this._overlayRef;

        if (!overlayRef) {
            this._portal = new TemplatePortal(this.appAutocomplete.matAutocomplete.template, this._viewContainerRef);
            overlayRef = this._overlay.create(this._getOverlayConfig());
            this._overlayRef = overlayRef;

            // Use the `keydownEvents` in order to take advantage of
            // the overlay event targeting provided by the CDK overlay.
            overlayRef.keydownEvents().subscribe(event => {
                // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
                // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
                if (Number(event.code) === ESCAPE || (Number(event.code) === UP_ARROW && event.altKey)) {
                    this._resetActiveItem();
                    this._closeKeyEventStream.next();
                }
            });

            if (this._viewportRuler) {
                this._viewportSubscription = this._viewportRuler.change().subscribe(() => {
                    if (this.panelOpen && overlayRef) {
                        overlayRef.updateSize({width: this._getPanelWidth()});
                    }
                });
            }
        } else {
            // Update the trigger, panel width and direction, in case anything has changed.
            this._positionStrategy.setOrigin(this._getConnectedElement());
            overlayRef.updateSize({width: this._getPanelWidth()});
        }

        if (overlayRef && !overlayRef.hasAttached()) {
            overlayRef.attach(this._portal);
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }

        const wasOpen = this.panelOpen;

        this.appAutocomplete.matAutocomplete._setVisibility();
        this.appAutocomplete.matAutocomplete._isOpen = this._overlayAttached = true;

        // We need to do an extra `panelOpen` check in here, because the
        // autocomplete won't be shown if there are no options.
        if (this.panelOpen && wasOpen !== this.panelOpen) {
            this.appAutocomplete.matAutocomplete.opened.emit();
        }
    }

    private _getOverlayConfig(): OverlayConfig {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getPanelWidth(),
            direction: this._dir
        });
    }

    private _getOverlayPosition(): PositionStrategy {
        const strategy = this._overlay.position()
            .flexibleConnectedTo(this._getConnectedElement())
            .withFlexibleDimensions(false)
            .withPush(false);

        this._setStrategyPositions(strategy);
        this._positionStrategy = strategy;
        return strategy;
    }

    /** Sets the positions on a position strategy based on the directive's input state. */
    private _setStrategyPositions(positionStrategy: FlexibleConnectedPositionStrategy) {
        const belowPosition: ConnectedPosition = {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top"
        };
        const abovePosition: ConnectedPosition = {
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",

            // The overlay edge connected to the trigger should have squared corners, while
            // the opposite end has rounded corners. We apply a CSS class to swap the
            // border-radius based on the overlay position.
            panelClass: "mat-autocomplete-panel-above"
        };

        let positions: ConnectedPosition[];

        if (this.position === "above") {
            positions = [abovePosition];
        } else if (this.position === "below") {
            positions = [belowPosition];
        } else {
            positions = [belowPosition, abovePosition];
        }

        positionStrategy.withPositions(positions);
    }

    private _getConnectedElement(): ElementRef {
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._element;
    }

    private _getPanelWidth(): number | string {
        return this.appAutocomplete.matAutocomplete.panelWidth || this._getHostWidth();
    }

    /** Returns the width of the input element, so the panel width can match it. */
    private _getHostWidth(): number {
        return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
    }

    /**
     * Resets the active item to -1 so arrow events will activate the
     * correct options, or to 0 if the consumer opted into it.
     */
    private _resetActiveItem(): void {
        this.appAutocomplete.matAutocomplete._keyManager.setActiveItem(this.appAutocomplete.matAutocomplete.autoActiveFirstOption ? 0 : -1);
    }

    /** Determines whether the panel can be opened. */
    private _canOpen(): boolean {
        const element = this._element.nativeElement;
        return !element.readOnly && !element.disabled && !this._autocompleteDisabled;
    }
}
