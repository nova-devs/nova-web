import {Component, Inject, OnInit} from '@angular/core';
import {Module} from "../../../../models/account/module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modules-dialog',
  templateUrl: './modules-dialog.component.html',
  styleUrls: ['./modules-dialog.component.scss']
})
export class ModulesDialogComponent implements OnInit{

    public modules: Module[] = [];

    constructor(public dialogRef: MatDialogRef<ModulesDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    public ngOnInit(): void {
        this.modules = this.data.modules;
    }

    public changeModule(module: any): void {
        this.dialogRef.close(module);
    }

}
