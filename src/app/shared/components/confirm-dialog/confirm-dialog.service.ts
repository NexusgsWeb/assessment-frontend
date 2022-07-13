import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog.component';
@Injectable()
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) { }
  dialogRef!: MatDialogRef<ConfirmDialogComponent>;

  public open(options: any) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
         data: {
           title: options.title,
           message: options.message,
           cancelText: options.cancelText,
           confirmText: options.confirmText
         }
    });
  }
  public confirmed(): Observable<any> {
    if(this.dialogRef){
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
        return res;
      }
    ))
    }
    return of(false)
  }
}
