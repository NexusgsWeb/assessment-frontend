import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { ForgetpasswordService } from 'src/app/modules/_services/forgetpassword.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sendresetpassword',
  templateUrl: './sendresetpassword.component.html',
  styleUrls: ['./sendresetpassword.component.css'],
})
export class SendresetpasswordComponent implements OnInit {
  defaultWallpaper = 'assets/images/massarat_login.png';
  logo = 'assets/images/massarat_logo.png';
  microsoftImage = 'assets/images/microsoft.png';
  googleImage = 'assets/images/google.png';

  userType;

  EmailModel: any = {};
  EmailForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private ForgetPasscodeService: ForgetpasswordService,
    private customDialog: DialogServiceService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUserType();
  }
  getUserType() {
    var subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'www') {
      subdomain = window.location.hostname.split('.')[1];
      if (subdomain === 'school' || 'School') {
        this.userType = 'user';
      } else if (subdomain === 'admin' || subdomain === 'Admin') {
        this.userType = 'admin';
      } else {
        this.customDialog.openDialog({
          title: 'Invalid Domain.... set as school user',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
        this.userType = 'user';
      }
    } else {
      console.log('second');
      if (subdomain === 'school' || subdomain === 'School') {
        this.userType = 'user';
      } else if (subdomain === 'admin' || subdomain === 'Admin') {
        this.userType = 'admin';
      } else {
        this.customDialog.openDialog({
          title: 'Invalid Domain.... set as school user',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
        this.userType = 'user';
      }
    }
    console.log('you are logged in as a ' + this.userType);
  }

  didClickResetPassword = () => {
    this.ForgetPasscodeService.forgetPasswordRequest(
      this.EmailForm.get('email').value,
      this.userType == 'admin' ? 'admin' : 'user'
    )
      .then((res) => {
        this.customDialog.openDialog({
          title: 'Success, Please check your email.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((err) => {
        console.log(err)
        this.customDialog.openDialog({
          title:
            'There was an error sending your request. Possible Reason: ' +
            err.error.message,
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  };

  returnToLogin(){
   
    this.location.back();

  }
}
