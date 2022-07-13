import {
  Component,
  Inject,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from 'src/app/modules/Models/DialogData';

@Component({
  selector: 'app-dialog-custom',
  templateUrl: './dialog-custom.component.html',
  styleUrls: ['./dialog-custom.component.css'],
})
export class DialogCustomComponent implements OnInit {
  data: any;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private _route: ActivatedRoute,
    private dialogRef: MatDialogRef<DialogCustomComponent>
  ) {
    this.data = this.dialogData ? this.dialogData : null;
    console.log(this.data);
  }

  ngOnInit(): void {
    try {
      if (this.dialogData) {
        this.data = this.dialogData;
      } else {
        this.data = this._route.snapshot.data;
      }
    } catch (err) {
      this.data = {
        title: 'An Internal Error has occurred. This error rarely shows up..',
        message: 'MESSAGE DIALOG',
        confirmText: 'THANKS',
        cancelText: 'WELCOME',
        DidConfirm: () => {},
      };
    }
  }
  didConfirm() {
    this.data.DidConfirm();
    this.dialogRef.close();
  }
  didCancel() {
    this.dialogRef.close();
  }
}
