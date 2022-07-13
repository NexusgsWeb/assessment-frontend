import { Component, HostListener, OnInit, ɵConsole } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { inject } from '@angular/core/testing';
import { LoadingManagerService } from './modules/_services/loading-manager.service';
import packageInfo from '../../package.json';
import { Subject, Subscription, fromEvent } from 'rxjs';
import { DialogServiceService } from './modules/_dialogs/shared/dialog-service.service';
import { AuthManagerService } from './modules/_services/auth-manager.service';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

declare const STABLE_FEATURE: boolean;
declare const EXPERIMENTAL_FEATURE: boolean;
export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;
  public version: string = packageInfo.version;
  private subdomain;
  subscription: Subscription;

  stableFeature: string;
  experimentalFeature: string;


  userActivity;
  loadAllowed: boolean = true;

  userInactive: Subject<any> = new Subject();

  // public userArray: User[] = [];


  constructor(
    private router: Router,
    private LoadingManager: LoadingManagerService,
    private DialogService: DialogServiceService,
    private authManager: AuthManagerService,
    private http: HttpClient
  ) {
    // this.http.get('assets/students_all.csv', {responseType: 'text'})
    // .subscribe(
    //     data => {
    //         let csvToRowArray = data.split("\n");
    //         for (let index = 1; index < csvToRowArray.length - 1; index++) {
    //           let row = csvToRowArray[index].split(",");
    //           this.userArray.push(new User( parseInt( row[0], 10), row[1], row[2], row[3], row[4], row[5], row[6], row[7]));
    //         }
    //         console.log(this.userArray);
    //     },
    //     error => {
    //         console.log(error);
    //     }
    // );

  }




  ngOnInit(): void {
    console.log('app app')
    // this.subscribeToNativeNavigation();
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !this.router.navigated;
      }
  });
    // this.stableFeature = STABLE_FEATURE ? 'Stable feature enabled' : 'Stable feature disabled';
    // this.experimentalFeature = EXPERIMENTAL_FEATURE ? 'Experimental feature enabled' : 'Experimental feature disabled';

    // console.log(this.stableFeature);
    // console.log(this.experimentalFeature)





    // this.loadAllowed = this.authManager.allowedLoading$.getValue();


    // this.getSubdomain();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();


  }

  private subscribeToNativeNavigation() {
    fromEvent(window, 'beforeunload')
    .pipe(
      filter(() => false)
    )
    .subscribe((e) => {
      const message = 'You may lose your data if you refresh now';
      (e || window.event).returnValue = !!message;
      return message;
    })
  }

  // getSubdomain() {
  //   const domain = window.location.hostname;
  //   if (
  //     !(domain.split('.')[0] === 'admin' || domain.split('.')[0] === 'school') ||
  //     domain.indexOf('.') < 0 ||
  //     domain.split('.')[0] === 'example' ||
  //     domain.split('.')[0] === 'lvh' ||
  //     domain.split('.')[0] === 'www'
  //   ) {
  //     this.subdomain = '';
  //     window.location.host("")
  //   } else {
  //     this.subdomain = domain.split('.')[0];
  //   }
  //   console.log('subdomain', this.subdomain);
  // }

  // @HostListener('window:onbeforeunload', ['$event'])
  // clearLocalStorage(event) {
  //   localStorage.clear();
  //   this.setTimeout();
  //   this.userInactive.subscribe(() =>
  //     this.DialogService.openDialog({
  //       title: 'Your session was ended due to inactivity. Please login again',
  //       message: 'MESSAGE DIALOG',
  //       confirmText: 'Cancel',
  //       cancelText: 'Extend',
  //       oneButton: false,
  //       DidConfirm: () => {
  //         this.authManager.logout();
  //       },
  //     })
  //   );

  //   console.log('hello there');
  // }
  // @HostListener('window:onbeforeunload', ['$event'])
  // clearLocalStorage(event) {
  //   localStorage.clear();
  // }

  setTimeout() {
    this.userActivity = setTimeout(
      () => this.userInactive.next(undefined),
      1800000
    );
  }

  @HostListener('window:beforeunload', ['$event'])
handleClose($event) {
    // $event.returnValue = false;
    $event.returnValue = "delete saved data"
}

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  @HostListener('window:keydown') refreshUserState2() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  // @HostListener('window:beforeunload')
  // async ngOnDestroy()
  // {

  //   let num = Number(localStorage.getItem('opened'));
  //   num = num - 1;
  //   if(num == 0){
  //     let remember = localStorage.getItem('remember');
  //     if(remember == 'false'){
  //       this.authManager.logout();
  //     }
  //   }
  // }
}
// export class User{
//   number: number;
//   name: String;
//   admissionNb: String;
//   admissionDate: String;
//   sectionName: String;
//   className: String;
//   gender: String;
//   fees: String;


//   constructor(number: number, name: String, admissionNb: String, admissionDate: String, sectionName: String,
//      className: String, gender: String, fees: String){
//     this.number = number;
//     this.name = name;
//     this.admissionNb = admissionNb;
//     this.admissionDate = admissionDate;
//     this.sectionName = sectionName;
//     this.className = className;
//     this.gender = gender;
//     this.fees = fees;

//   }
// }
