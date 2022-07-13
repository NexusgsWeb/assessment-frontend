import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgetpasswordService } from '../../_services/forgetpassword.service';
import { DialogServiceService } from '../shared/dialog-service.service';

@Component({
  selector: 'app-resetpassworddialog',
  templateUrl: './resetpassworddialog.component.html',
  styleUrls: ['./resetpassworddialog.component.css'],
})
export class ResetpassworddialogComponent implements OnInit {
  PasswordFormGroup: UntypedFormGroup = new UntypedFormGroup({
    NewPassword: new UntypedFormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    NewPasswordConfirm: new UntypedFormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(6)])
    ),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: DialogServiceService,
    private dialogRef: MatDialogRef<ResetpassworddialogComponent>,
    private forgetPasswwordService: ForgetpasswordService
  ) {}

  ngOnInit(): void {}
  didConfirmChangePassword() {
    //Validate Both Fields.
    // this.resetPasswordService.forceResetPassword();
    if (
      this.PasswordFormGroup.controls['NewPassword'].value !==
      this.PasswordFormGroup.controls['NewPasswordConfirm'].value
    ) {
      this.dialogService.openDialog({
        title: 'The Passwords do not match..',
        message: '',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
      return;
    }
    this.forgetPasswwordService
      .forceResetPassword(
        this.data.user_id,
        this.PasswordFormGroup.controls['NewPassword'].value
      )
      .then((res) => {
        this.dialogRef.close();
        this.dialogService.openDialog({
          title: 'The Password has been changed.',
          message: '',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((err) => {
        this.dialogService.openDialog({
          title: JSON.stringify(err),
          message: err,
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  didClickCancel() {
    this.dialogRef.close();
  }
  passwordMatchValidator(frm: UntypedFormGroup) {
    return frm.controls['NewPassword'].value ===
      frm.controls['NewPasswordConfirm'].value
      ? null
      : { mismatch: true };
  }
}
