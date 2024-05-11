import {animate, state, style, transition, trigger} from "@angular/animations";

export const SIDENAV_EXPANDED = [
    trigger("sidenavIsExpanded", [
        state("true", style({
            width: "280px"
        })),
        state("false", style({
            width: "74px"
        })),
        transition("false <=> true", animate("100ms ease"))
    ])
];

export const SIDENAV_CONTENT_EXPANDED = [
    trigger("sidenavContentIsExpanded", [
        state("true", style({
            "margin-left": "280px"
        })),
        state("false", style({
            "margin-left": "74px"
        })),
        transition("false <=> true", animate("100ms ease"))
    ])
];
