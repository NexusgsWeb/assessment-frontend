import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { ForgetpasswordService } from 'src/app/modules/_services/forgetpassword.service';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.css'],
})
export class ForgetPassComponent implements OnInit {
  userType: string = 'NO_TYPE_SET';
  token: string = 'NO_TOKEN_SET';
  newPass: string = '';
  newPassRepeat: string = '';

  constructor(
    private forgetPasswordSerivce: ForgetpasswordService,
    private customDialog: DialogServiceService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    try {
      this.userType = this.ActivatedRoute.snapshot.queryParams['type'];
      this.token = this.ActivatedRoute.snapshot.queryParams['token'];

      console.log('type: ' + this.userType);
      console.log('token: ' + this.token);

      if (this.userType === undefined || this.token === undefined) {
        throw new Error();
      }
      console.log(this.userType);
      console.log(this.token);
    } catch (err) {
      console.log('called4')

      this.router.navigate(['/auth']);
    }
  }

  AttemptToReset() {
    this.forgetPasswordSerivce
      .resetPasswordRequest(this.userType, this.token, this.newPass)
      .then((res) => {
        this.customDialog.openDialog({
          title: 'Your Password Has Been Successfully changed.',
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            console.log('called5')
            this.router.navigate(['/auth']);
          },
        });
      })
      .catch((err) => {
        this.customDialog.openDialog({
          title:
            'There was an error resetting your password.. Possible Reason : ' +
            err.error.message,
          message: 'test',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  returnToLogin(){
    console.log('called6')

    console.log('entered entered 1')
    // console.log(localStorage.getItem('typeSchool'))
    // console.log(localStorage.getItem('tenant'))

    // localStorage.removeItem('forget')

      
        // this.router.navigate(['/auth'], {
      //   relativeTo: this.activatedRoute.parent,
      //   queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
      // } ); 

    this.router.navigate(['/auth'], {
      relativeTo: this.ActivatedRoute.parent,
      // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
    } );
  }
}
