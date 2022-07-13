import { Injectable, NgModule } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../Models/DialogData';
import { DialogCustomComponent } from './dialog-custom/dialog-custom.component';

@Injectable({
  providedIn: 'root',
})
export class DialogServiceService {
  constructor(private dialog: MatDialog) {}

  openDialog(data: DialogData) {
    this.dialog.open(DialogCustomComponent, { data: data });
  }
}
