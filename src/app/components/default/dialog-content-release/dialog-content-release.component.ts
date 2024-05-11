import {Component, Inject} from '@angular/core';
import {ReleaseNotes} from "../../../models/release_notes";
import {PageEvent} from "@angular/material/paginator";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'app-dialog-content-release',
    styleUrls: ['./dialog-content-release.component.scss'],
    templateUrl: './dialog-content-release.component.html',
})
export class DialogContentReleaseComponent {

    currentPage = 1;
    pageSize = 3;

    constructor(@Inject(MAT_DIALOG_DATA) public data: ReleaseNotes[]) {
    }

    onPageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;
    }
}
