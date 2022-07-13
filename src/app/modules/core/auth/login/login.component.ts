import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../Models/User';
import { CookieService } from 'ngx-cookie-service';
import {
  SocialAuthService,
  MicrosoftLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { login_admin_dittofi } from 'src/app/shared/static_data/apiURL';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() userDomainType;

  userType = 'user';

  loginCredentials: any = {};
  schoolLogo: any = '';
  schoolProfileImage: any = '';

  showPassword = false;

  defaultWallpaper = 'assets/images/massarat_login.png';
  logo = 'assets/images/school_logo.png';
  microsoftImage = 'assets/images/microsoft.png';
  googleImage = 'assets/images/google.png';

  errorMsg = '';
  RememberMe = false;
  tenant: string = '';
  type: string = '';
  public ADMIN_TOKEN_NAME = 'ADMIN_TOKEN';


  constructor(
    private authService: SocialAuthService,
    private authSerrvice: AuthManagerService,
    private customDialog: DialogServiceService,
    private accountService: AuthManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.tenant = this.activatedRoute.snapshot.queryParams['tenant'];
    this.type = this.activatedRoute.snapshot.queryParams['type'];
    localStorage.setItem('typeSchool', this.type);
    localStorage.setItem('tenant', this.tenant);



    console.log(this.tenant)

    var subdomain = window.location.hostname.split('.')[0];
    if (subdomain === 'www') {
      console.log('it is www');
      var subd = window.location.hostname.split('.')[1];
      console.log('IT IS' + subd);
      if (subd === 'school' || subd === 'School') {
        this.userType = 'user';
      } else if (subd === 'admin' || subd === 'Admin') {
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
    // this.getUserType();
  }
  didPressRememberMe() {
    this.RememberMe = !this.RememberMe;
  }
  login(): void {
    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('loginPass') as HTMLInputElement;

  //   console.log(this.loginCredentials)
  //   this.http.post<any>("https://dittofi.com/1388/iapi/v1/super_admin_login", {"username":"maher@maher.com" , "password":"1234"}).subscribe(data => {
  //     console.log(data)
  // });
  //   this.http.post<any>(login_admin_dittofi, this.loginCredentials).subscribe(data => {
  //     console.log(data)
  // });

    if (username.value.length === 0) {
      username.classList.add('is-danger');
    } else if (password.value.length === 0) {
      password.classList.add('is-danger');
    } else {
      username.classList.remove('is-danger');
      password.classList.remove('is-danger');



      if (this.userType === 'admin') {

        console.log('logging in as a admin rn..');
        console.log(this.loginCredentials)

      //   this.http.post<any>(login_admin_dittofi, this.loginCredentials).subscribe(data => {
      //     console.log(data)
      // });
        this.accountService
          .adminLoginDittofi(this.loginCredentials)
          .then((response: any) => {

            console.log(response)
            const obj = {
              message: "success",
              token: {
                expiresIn: 'Fri, 08 Apr 2022 10:28:00 GMT',
                token: 'MTY0NjgyMTY4MHxOd3dBTkVwVVUwNVZVMHhRU1RRMldrTlBNa1F5U1VoU1FrbEJXVWhhVDBSSlRrbFVURU5UVkROUlF6Wk9UalpDVkUxR1VFNUtWVUU9fMX7ny-y5pk-_YI1hNt57E-x4KYn-gFa3DYAUldjVkH6',
                user: {
                  id: response.data.Id,
                  name: response.data.first_name + ' ' + response.data.middle_name + ' ' + response.data.last_name,
                  salt: 'super_admin',
                  role: [{roleName: 'SuperAdmin'}]
                }
              }

            }

            localStorage.setItem('type', obj.token.user.role[0].roleName);


            localStorage.setItem(
              this.ADMIN_TOKEN_NAME,
              JSON.stringify(obj.token)
            );

            this.router.navigateByUrl('/dashboard');
          })
          .catch((error) => {
            console.log(error);
            const msg = error.status;
            if (msg === 404) {
              this.errorMsg =
                'Sorry, we could not find an account with that username!';
            } else if (msg === 401) {
              this.errorMsg =
                'Sorry, you have entered an incorrect password. Click on Forget Password.';
            }
          });
      } else if (this.userType === 'user') {
        console.log('logging in as a user rn..');

        this.accountService
          .userLoginDittofi(this.loginCredentials)
          .then((response: any) => {
            console.log(response)


            this.accountService.getMe(response.data.Id).then((data : any) => {
              console.log("data data")
              console.log(data)

              const obj = {
                message: "success",
                token: {
                  expiresIn: 'Tue, 12 Apr 2022 16:10:26 GMT',
                  token: 'MTY0NzE4NzgyNnxOd3dBTkVkYVRFWk5WVVpWUWt3M1FrdFlTRkZOTlV3ME1rZERVVU5HTjFwVk4xUTFRVGRGVFZsU1IxSkZSVEkwTTFveVNFYzJSMUU9fDmbbPc2KiHECYUAEtUAS3pb9Q_Z-3T_aHcdBzVqotbb',
                  user: {
                    id: response.data.Id,
                    name: response.data.first_name + ' ' + response.data.middle_name + ' ' + response.data.last_name,
                    salt: data.data.role_name,
                    role: [{roleName: data.data.role_name, schoolId: data.data.school_id,
                      organizationId: data.data.organization_id, sectionId: data.data.section_id}],
                    tenant: {id: "dc5281c1-f1a8-49b4-bc34-3f7dd1648d3e", code: "iquad"}
                  }
                }

              }

              localStorage.setItem('type', obj.token.user.role[0].roleName);
              localStorage.setItem('schoolName', obj.token.user.tenant.code);
              localStorage.setItem(
                this.ADMIN_TOKEN_NAME,
                JSON.stringify(obj.token)
              );

              this.router.navigateByUrl('/dashboard');

            }).catch((data) => {
              console.log(data)
            });

            // this.router.navigateByUrl('/dashboard');
            // this.router.navigateByUrl('/assessment/viewAssessments');
          })
          .catch((error) => {
            console.log(error)
            console.log(error.status);
            const msg = error.status;
            if (msg === 400) {
              this.errorMsg =
                'Sorry, we could not find an account with that username!';
            } else if (msg === 401) {
              this.errorMsg =
                'Sorry, you have entered an incorrect password. Click on Forget Password.';
            }
          });
      } else {
        this.customDialog.openDialog({
          title: 'There was a FATAL ERROR.',
          message: 'test',
          confirmText: 'Try Again',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
            this.router.navigate['/'];
          },
        });
      }

      // this.router.navigateByUrl('home');
    }
  }
  googleSignIn(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (response) => {
        console.log(response)

        const sso = {
          provider: 'microsoft',
          idToken: response.idToken
        }
        const tempLogin = {
          username: response.email,
          password: 'password'
        }
        if (this.userType === 'admin') {

          console.log('logging in as a admin rn..');
          console.log(this.loginCredentials)

          this.accountService
            .adminLoginDittofi(tempLogin)
            .then((response: any) => {
              console.log(response);
              this.router.navigateByUrl('/dashboard');
            })
            .catch((error) => {
              console.log(error.status);
              const msg = error.status;
              if (msg === 404) {
                this.errorMsg =
                  'Sorry, we could not find an account with that username!';
              } else if (msg === 401) {
                this.errorMsg =
                  'Sorry, you have entered an incorrect password. Click on Forget Password.';
              }
            });
        } else if (this.userType === 'user') {
          console.log('logging in as a user rn..');

          this.accountService
            .userLoginDittofi(tempLogin)
            .then((response: any) => {
              console.log(response)
              localStorage.setItem('type', response.token.user.role[0].roleName);
              localStorage.setItem('schoolName', response.token.user.tenant.code);

              // this.router.navigateByUrl('/dashboard');
              // this.router.navigateByUrl('/assessment/viewAssessments');
            })
            .catch((error) => {
              console.log(error)
              console.log(error.status);
              const msg = error.status;
              if (msg === 400) {
                this.errorMsg =
                  'Sorry, we could not find an account with that username!';
              } else if (msg === 401) {
                this.errorMsg =
                  'Sorry, you have entered an incorrect password. Click on Forget Password.';
              }
            });
        } else {
          this.customDialog.openDialog({
            title: 'There was a FATAL ERROR.',
            message: 'test',
            confirmText: 'Try Again',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {
              this.router.navigate['/'];
            },
          });
        }
      },
      (error) => {

        console.log(error)
      }
    );
  }

  async microsoftSignIn(): Promise<void> {
    // this.authService2.signOut();
    // await this.authService2.signIn();
    this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID).then(
      (response) => {
        console.log(response)

        const sso = {
          provider: 'microsoft',
          idToken: response.idToken
        }
        const tempLogin = {
          username: response.email,
          password: 'password'
        }
        if (this.userType === 'admin') {

          console.log('logging in as a admin rn..');
          console.log(this.loginCredentials)
          this.http.post<any>(login_admin_dittofi, this.loginCredentials).subscribe(data => {
            console.log(data)
        });
          // this.accountService
          //   .adminLoginDittofi(tempLogin)
            // .then((response: any) => {
            //   console.log(response);
            //   this.router.navigateByUrl('/dashboard');
            // })
            // .catch((error) => {
            //   console.log(error.status);
            //   const msg = error.status;
            //   if (msg === 404) {
            //     this.errorMsg =
            //       'Sorry, we could not find an account with that username!';
            //   } else if (msg === 401) {
            //     this.errorMsg =
            //       'Sorry, you have entered an incorrect password. Click on Forget Password.';
            //   }
            // });
        } else if (this.userType === 'user') {
          console.log('logging in as a user rn..');

          this.accountService
            .userLoginDittofi(tempLogin)
            .then((response: any) => {
              console.log(response)
              localStorage.setItem('type', response.token.user.role[0].roleName);
              localStorage.setItem('schoolName', response.token.user.tenant.code);

              // this.router.navigateByUrl('/dashboard');
              // this.router.navigateByUrl('/assessment/viewAssessments');
            })
            .catch((error) => {
              console.log(error)
              console.log(error.status);
              const msg = error.status;
              if (msg === 400) {
                this.errorMsg =
                  'Sorry, we could not find an account with that username!';
              } else if (msg === 401) {
                this.errorMsg =
                  'Sorry, you have entered an incorrect password. Click on Forget Password.';
              }
            });
        } else {
          this.customDialog.openDialog({
            title: 'There was a FATAL ERROR.',
            message: 'test',
            confirmText: 'Try Again',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {
              this.router.navigate['/'];
            },
          });
        }

      },
      (error) => {
        console.log(error)

      }
    );
  }

  toggleShow() {
    console.log('hello');
    this.showPassword = !this.showPassword;
    // this.input.type = this.showPassword ? 'text' : 'password';
  }

  forgetPass(): void {
    this.router.navigateByUrl('/forget');
  }
  showHidePassword() {
    const eye = document.getElementById('togglePassword');

    const pass = document.getElementById('loginPass') as HTMLInputElement;
    if (eye.classList.contains('fa-eye')) {
      eye.classList.remove('fa-eye');
      eye.classList.add('fa-eye-slash');
      this.showPassword = false;
    } else {
      eye.classList.remove('fa-eye-slash');
      eye.classList.add('fa-eye');
      this.showPassword = true;
    }
    console.log('pressed');
  }
}
