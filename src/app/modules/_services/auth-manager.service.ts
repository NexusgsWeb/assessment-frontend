import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { adminLogin, userLogin, login_admin_dittofi, login_user_dittofi, get_me } from 'src/app/shared/static_data/apiURL';
import { DialogServiceService } from '../_dialogs/shared/dialog-service.service';
import { BehaviorSubject } from 'rxjs';
import { ServerResponse } from 'http';


@Injectable({
  providedIn: 'root',
})
export class AuthManagerService {
  public ADMIN_TOKEN_NAME = 'ADMIN_TOKEN';
  USER_TOKEN_NAME = 'USER_TOKEN';
  allowedLoading$ = new BehaviorSubject<boolean>(true);


  user_Type;
  redirectUrl: string;



  constructor(
    private http: HttpClient,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private customDialog: DialogServiceService
  ) {}

  adminLoginDittofi(model: any){
  // const httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

  // withCredentials: true,
  // observe: 'response' as 'response'
  // };

      // return this.http.post(login_admin_dittofi,model,httpOptions).subscribe((data : HttpResponse<any>) => {
      //   console.log(data.headers.getAll('Headers'));
      // })


  return new Promise((resolve, reject) => {
    this.http
      .post(login_admin_dittofi, model, {"withCredentials": true})
      .toPromise()
      .then((res) => resolve(res))
      .catch((res) => reject(res));

  })

  // });
    // const d = new Date();
    // const d_string = d.toISOString()
    // console.log(d_string)
    // const length = model.username.length + model.password.length;
    // console.log(length)

    // const headers = new HttpHeaders()
    // .set('Accept', 'application/json')






  }
  adminLogin(model: any, isRemembered, tenant: string, type: string, sso) {
    const body = {
      'tenant' : tenant,
      'type' : type,
      'ssoDate': sso
    }
    return new Promise((resolve, reject) => {
      this.http
        .post(adminLogin, model, { params: body })
        .toPromise()
        .then((res: any) => {
          resolve(res);

          localStorage.setItem(
            this.ADMIN_TOKEN_NAME,
            JSON.stringify(res.token)
          );
        })
        .catch((err) => reject(err));
    });
  }
  getTypeOfUser() {
    try {
      var type = localStorage.getItem('type').toLowerCase();
      console.log('HELLOO  TYPE IS ' + type);

      console.log(type == 'teacher')
      switch (type) {
        case'teacher':
          return 'teacher';
        case 'student':
          return 'student';
        case 'parent':
          return 'parent';
        case 'superadmin':
          return 'super';

        default: {
          console.log('you are super admin');
          return 'admin';
        }
      }
    } catch (err) {
      console.log('THERE WAS A FATAL ERROR.');
      console.log(err);
    }
  }
  getUserType() {
    let STUDENT_RECORD = JSON.parse(localStorage.getItem('REC'));
    console.log(STUDENT_RECORD);

    // const student = JSON.parse(localStorage.getItem('REC'));

    // const token = JSON.parse(localStorage.getItem('ADMIN_TOKEN'));
    // if (token.user.role === 'SuperAdmin') {
    //   return 'admin';
    // } else if (token.user.role === '') {
    // }
    return STUDENT_RECORD;
  }
  CheckIfAuthenticatedAdmin(): Boolean {
    console.log('checking');
    try {
      if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
        if (JSON.parse(sessionStorage.getItem(this.ADMIN_TOKEN_NAME)) != null) {
          let token = JSON.parse(sessionStorage.getItem(this.ADMIN_TOKEN_NAME));
          if (Date.now() >= token.expiresIn * 1000) {
            return false;
          }
          return true;
        } else {
          let token = JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME));
          if (Date.now() >= token.expiresIn * 1000) {
            return false;
          }
          return true;
        }
      }
      return true;
    } catch (err) {
      console.log('an error..');

      return false;
    }
  }
  //User Token
  getUserToken() {
    // let STATIC_USER_TOKEN =
    //   'Bearer ' +
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQ5NTgxNTMsImRhdGEiOnsiaWQiOiJlZTBkMjY1YS03MDVlLTQ2MzMtODc5MC0zNzViMzM4MzhhN2MiLCJuYW1lIjoiRGVtbyBVc2VyIiwicm9sZSI6W3sicm9sZU5hbWUiOiJTY2hvb2wgVXNlciIsInNjaG9vbElkIjoiZGM1MjgxYzEtZjFhOC00OWI0LWJjMzQtM2Y3ZGQxNjQ4ZDNlIiwib3JnYW5pemF0aW9uSWQiOiIwZDA0Zjk1OC0wNzk1LTQ2OGQtOTUwOS1hYjQzZTViYzcyZmYifV19LCJpYXQiOjE2MjQzNTMzNTMsImF1ZCI6IkpXVF9UT0tFTl9BVURJRU5DRSIsImlzcyI6IkpXVF9UT0tFTl9JU1NVRVIifQ.W9-njLSVw4Dx-mwrcLsDewa1taz3q48cTrwIs-lKv5Y';
    return this.getToken();
  }
  //Admin Token
  getToken() {
    // let STATIC_USER_TOKEN =
    //   'Bearer ' +
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQ5NTgxNTMsImRhdGEiOnsiaWQiOiJlZTBkMjY1YS03MDVlLTQ2MzMtODc5MC0zNzViMzM4MzhhN2MiLCJuYW1lIjoiRGVtbyBVc2VyIiwicm9sZSI6W3sicm9sZU5hbWUiOiJTY2hvb2wgVXNlciIsInNjaG9vbElkIjoiZGM1MjgxYzEtZjFhOC00OWI0LWJjMzQtM2Y3ZGQxNjQ4ZDNlIiwib3JnYW5pemF0aW9uSWQiOiIwZDA0Zjk1OC0wNzk1LTQ2OGQtOTUwOS1hYjQzZTViYzcyZmYifV19LCJpYXQiOjE2MjQzNTMzNTMsImF1ZCI6IkpXVF9UT0tFTl9BVURJRU5DRSIsImlzcyI6IkpXVF9UT0tFTl9JU1NVRVIifQ.W9-njLSVw4Dx-mwrcLsDewa1taz3q48cTrwIs-lKv5Y';
    let STATIC_ADMIN_TOKEN =
      'Bearer ' +
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQ5NTgxMzksImRhdGEiOnsiaWQiOiI2ZWMwYmQ3Zi0xMWMwLTQzZGEtOTc1ZS0yYThhZDllYmFlMGIiLCJuYW1lIjoiU3VwZXIgQWRtaW4iLCJzYWx0Ijoic3VwZXJfYWRtaW5faXF1YWRtZSIsInJvbGUiOiJTdXBlckFkbWluIn0sImlhdCI6MTYyNDM1MzMzOSwiYXVkIjoiSldUX1RPS0VOX0FVRElFTkNFIiwiaXNzIjoiSldUX1RPS0VOX0lTU1VFUiJ9.sG8GQIDsaFPkVYrcftIvzg2WcFHtQOqXwmfQQMyYFiw';
    if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
      if (sessionStorage.getItem(this.ADMIN_TOKEN_NAME) !== null) {
        if (this.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            sessionStorage.getItem(this.ADMIN_TOKEN_NAME)
          );
          return 'Bearer ' + JWTObject.token;
        }
      }
    } else {
      sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
      if (this.CheckIfAuthenticatedAdmin) {
        let JWTObject: any = JSON.parse(
          localStorage.getItem(this.ADMIN_TOKEN_NAME)
        );
        return 'Bearer ' + JWTObject.token;
      }
    }
    return null;

  }

  getUserName() {
    if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
      if (sessionStorage.getItem(this.ADMIN_TOKEN_NAME) !== null) {
        if (this.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            sessionStorage.getItem(this.ADMIN_TOKEN_NAME)
          );
          return JWTObject.user.name;
        }
      }
    } else {
      sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
      if (this.CheckIfAuthenticatedAdmin) {
        let JWTObject: any = JSON.parse(
          localStorage.getItem(this.ADMIN_TOKEN_NAME)
        );
        return JWTObject.user.name;
      }
    }
    this.customDialog.openDialog({
      title: 'There was an error getting your username',
      message: 'test',
      confirmText: 'OK',
      cancelText: 'Cancel',
      oneButton: true,
      DidConfirm: () => {
        console.log('called1')
        this.router.navigate(['/auth'], {
          relativeTo: this.activeRoute.parent,
          // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
        } );      },
    });
    return null;
    // return STATIC_ADMIN_TOKEN;
    // return STATIC_USER_TOKEN;
  }

  getUserId() {
    if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
      if (sessionStorage.getItem(this.ADMIN_TOKEN_NAME) !== null) {
        if (this.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            sessionStorage.getItem(this.ADMIN_TOKEN_NAME)
          );
          return JWTObject.user.id;
        }
      }
    } else {
      sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
      if (this.CheckIfAuthenticatedAdmin) {
        let JWTObject: any = JSON.parse(
          localStorage.getItem(this.ADMIN_TOKEN_NAME)
        );
        return JWTObject.user.id;
      }
    }
    this.customDialog.openDialog({
      title: 'There was an error getting your username',
      message: 'test',
      confirmText: 'OK',
      cancelText: 'Cancel',
      oneButton: true,
      DidConfirm: () => {
        console.log('called1')
        this.router.navigate(['/auth'], {
          relativeTo: this.activeRoute.parent,
          // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
        } );      },
    });
    return null;
    // return STATIC_ADMIN_TOKEN;
    // return STATIC_USER_TOKEN;
  }

  getSchoolId() {
    if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
      if (sessionStorage.getItem(this.ADMIN_TOKEN_NAME) !== null) {
        if (this.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            sessionStorage.getItem(this.ADMIN_TOKEN_NAME)
          );
          return JWTObject.user.role[0].schoolId;
        }
      }
    } else {
      sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
      if (this.CheckIfAuthenticatedAdmin) {
        let JWTObject: any = JSON.parse(
          localStorage.getItem(this.ADMIN_TOKEN_NAME)
        );
        return JWTObject.user.role[0].schoolId;
      }
    }
    this.customDialog.openDialog({
      title: 'There was an error getting your School ID',
      message: 'test',
      confirmText: 'OK',
      cancelText: 'Cancel',
      oneButton: true,
      DidConfirm: () => {
        console.log('called2')

        this.router.navigate(['/auth'], {
          relativeTo: this.activeRoute.parent,
          // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
        } );      },
    });
    return null;
    // return STATIC_ADMIN_TOKEN;
    // return STATIC_USER_TOKEN;
  }

  getOrganizationId() {
    if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
      if (sessionStorage.getItem(this.ADMIN_TOKEN_NAME) !== null) {
        if (this.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            sessionStorage.getItem(this.ADMIN_TOKEN_NAME)
          );
          return JWTObject.user.role[0].organizationId;
        }
      }
    } else {
      sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
      if (this.CheckIfAuthenticatedAdmin) {
        let JWTObject: any = JSON.parse(
          localStorage.getItem(this.ADMIN_TOKEN_NAME)
        );
        return JWTObject.user.role[0].organizationId;
      }
    }
    this.customDialog.openDialog({
      title: 'There was an error getting your Organization ID',
      message: 'test',
      confirmText: 'OK',
      cancelText: 'Cancel',
      oneButton: true,
      DidConfirm: () => {
        console.log('called2')

        this.router.navigate(['/auth'], {
          relativeTo: this.activeRoute.parent,
          // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
        } );      },
    });
    return null;
    // return STATIC_ADMIN_TOKEN;
    // return STATIC_USER_TOKEN;
  }

  getSectionId() {
    if (JSON.parse(localStorage.getItem(this.ADMIN_TOKEN_NAME)) === null) {
      if (sessionStorage.getItem(this.ADMIN_TOKEN_NAME) !== null) {
        if (this.CheckIfAuthenticatedAdmin) {
          let JWTObject: any = JSON.parse(
            sessionStorage.getItem(this.ADMIN_TOKEN_NAME)
          );
          return JWTObject.user.role[0].sectionId;
        }
      }
    } else {
      sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
      if (this.CheckIfAuthenticatedAdmin) {
        let JWTObject: any = JSON.parse(
          localStorage.getItem(this.ADMIN_TOKEN_NAME)
        );
        return JWTObject.user.role[0].sectionId;
      }
    }
    this.customDialog.openDialog({
      title: 'There was an error getting your Section ID',
      message: 'test',
      confirmText: 'OK',
      cancelText: 'Cancel',
      oneButton: true,
      DidConfirm: () => {
        console.log('called2')

        this.router.navigate(['/auth'], {
          relativeTo: this.activeRoute.parent,
          // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
        } );      },
    });
    return null;
    // return STATIC_ADMIN_TOKEN;
    // return STATIC_USER_TOKEN;
  }



  logout() {
    localStorage.removeItem(this.ADMIN_TOKEN_NAME);
    sessionStorage.removeItem(this.ADMIN_TOKEN_NAME);
    console.log('called3')

    this.router.navigate(['/auth'], {
      relativeTo: this.activeRoute.parent,
      // queryParams: { type: localStorage.getItem('typeSchool'), tenant: localStorage.getItem('tenant')}
    } );
  }


  userLoginDittofi(model: any) {

    return new Promise((resolve, reject) => {
      this.http
        .post(login_user_dittofi, model)
        .toPromise()
        .then((res: any) => {
          resolve(res);
          // if (isRemembered) {
          //   localStorage.setItem('remember', 'true');

          // } else {
          //   localStorage.setItem('remember', 'false');

          // localStorage.removeItem(this.ADMIN_TOKEN_NAME);
          // sessionStorage.setItem(
          //   this.ADMIN_TOKEN_NAME,
          //   JSON.stringify(res.token)
          // );
          // }
          localStorage.setItem(
            this.ADMIN_TOKEN_NAME,
            JSON.stringify(res.token)
          );
          localStorage.setItem('REC', JSON.stringify(res.studentRecord));
          console.log(this.redirectUrl);
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            this.redirectUrl = null;
          } else {
            this.router.navigate(['/dashboard']);
          }
        })
        .catch((err) => reject(err));
    });
  }

  getStudentId() {
    try {
      var obj = JSON.parse(localStorage.getItem('REC'));
      console.log(obj[0].userId);
      return obj[0].userId + '';
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  CheckIfAuthenticatedUser() {
    try {
      let token = JSON.parse(localStorage.getItem('USER_TOKEN'));
      if (Date.now() >= token.expiresIn * 1000) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  getMe(user_id){
    const headers = new HttpHeaders()
    .set('content-type', 'application/json');
  return new Promise((resolve, reject) => {
    this.http
      .get(get_me(user_id), {
        headers: headers,
        withCredentials: true
      })
      .toPromise()
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  }
}
