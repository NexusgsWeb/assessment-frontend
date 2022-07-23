import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { School } from '../../Models/school';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthManagerService } from '../../_services/auth-manager.service';
import {
  sideNavAnimation,
  sideNavContainerAnimation,
  slider,
} from '../../animations/animations';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AssessmentManagerService } from '../../_services/assessment-manager.service';
import { QuestionmanagerService } from '../../_services/questionmanager.service';
import { HttpClient } from '@angular/common/http';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { CountriesService } from '../../_services/countries.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [slider],
})
export class DashboardComponent implements OnInit {
  sideNavExpanded: boolean = false;

  assessmentLink: boolean = false;
  configurationsLink: boolean = false;
  studentsLink: boolean = false;
  EmployeesLink: boolean = false;
  AssessmentTeacherLink: boolean = false;
  AssessmentStudentLink: boolean = false;
  AssessmentParentLink: boolean = false;
  QuestionBankLink: boolean = false;
  QuestionBankAdminLink: boolean = false;
  ImprovePerformanceLink: boolean = false;
  LessonPlanLink: boolean = true;
  userType = '';
  schoolName: string = '';
  domainLS = [];
  grades = [];
  grades1 = [];
  ls = [];

  schoolId: string;
  modules: any = [];
  schools: School[] = [];
  sideBarOpen = true;

  //delete pop over
  popoverTitle = 'popoverTitle';
  popoverMessage = 'popoverMessage';
  clickConfirmed: boolean = false;
  cancelClicked: boolean = false;
  name: string = '';
  nameSybmol: string = '';
  questions = [];
  answers = [];
  remaining = [];

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  );

  private _mobileQueryListener: () => void;

  isStudent: boolean = false;

  constructor(
    private auth: AuthManagerService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public assessmentManagerService: AssessmentManagerService,
    private questionManager: QuestionmanagerService,
    private http: HttpClient,
    private countriesService: CountriesService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    console.log('countries: ');

    this.schoolName = localStorage.getItem('schoolName');

    this.name = this.auth.getUserName();

    const comp = this.name.split(' ', 2);
    this.nameSybmol = comp[0].charAt(0) + comp[1].charAt(0);

    var chosenType = this.auth.getTypeOfUser();
    console.log(chosenType);
    var types = ['teacher', 'parent', 'admin', 'student', 'super'];
    if (types.includes(chosenType)) {
      this.userType = chosenType;
    } else {
      this.userType = 'admin';
    }
    console.log(this.userType);
    this.updatePermissions();
  }

  toggleSidebar() {
    console.log(this.sideBarOpen);
    this.sideBarOpen = !this.sideBarOpen;
  }
  didClickNavigate(PATH, param?) {
    this.assessmentManagerService.editedAssessment$.next(null);
    this.assessmentManagerService.learningStandards$.next(null);
    this.assessmentManagerService.viewAssessementsObject$.next(null);
    this.assessmentManagerService.time$.next(null);
    this.assessmentManagerService.results$.next(null);
    this.assessmentManagerService.questions$.next(null);
    this.assessmentManagerService.newAssessment$.next(null);
    this.assessmentManagerService.assessmentData$.next(null);
    this.assessmentManagerService.published$.next(null);
    this.assessmentManagerService.finishedAsst$.next(false);
    this.assessmentManagerService.selectedSections$.next(null);
    this.assessmentManagerService.answeredQuestions$.next(null);
    this.router.navigateByUrl(PATH);
  }
  updatePermissions() {
    switch (this.userType) {
      case 'super':
        this.assessmentLink = false;
        this.configurationsLink = true;
        this.studentsLink = true;
        this.EmployeesLink = true;
        this.AssessmentTeacherLink = true;
        this.AssessmentStudentLink = false;
        this.AssessmentParentLink = false;
        this.QuestionBankLink = false;
        this.QuestionBankAdminLink = true;
        this.ImprovePerformanceLink = true;
        break;
      case 'admin':
        this.assessmentLink = false;
        this.configurationsLink = true;
        this.studentsLink = true;
        this.EmployeesLink = true;
        this.AssessmentTeacherLink = true;
        this.AssessmentStudentLink = false;
        this.AssessmentParentLink = false;
        this.QuestionBankLink = false;
        this.QuestionBankAdminLink = true;
        this.ImprovePerformanceLink = true;
        break;
      case 'student':
        this.assessmentLink = false;
        this.configurationsLink = false;
        this.studentsLink = false;
        this.EmployeesLink = false;
        this.AssessmentTeacherLink = false;
        this.AssessmentStudentLink = true;
        this.AssessmentParentLink = false;
        this.QuestionBankLink = false;
        this.QuestionBankAdminLink = false;
        this.ImprovePerformanceLink = false;
        break;
      case 'parent':
        this.assessmentLink = false;
        this.configurationsLink = false;
        this.studentsLink = false;
        this.EmployeesLink = false;
        this.AssessmentTeacherLink = false;
        this.AssessmentStudentLink = false;
        this.AssessmentParentLink = true;
        this.QuestionBankLink = false;
        this.QuestionBankAdminLink = false;
        this.ImprovePerformanceLink = false;
        break;
      case 'teacher':
        this.assessmentLink = false;
        this.configurationsLink = false;
        this.studentsLink = false;
        this.EmployeesLink = false;
        this.AssessmentTeacherLink = true;
        this.AssessmentStudentLink = false;
        this.AssessmentParentLink = false;
        this.QuestionBankLink = true;
        this.QuestionBankAdminLink = false;
        this.ImprovePerformanceLink = false;
        break;
    }
  }

  loadModule() {
    // this.homeService.loadModules(this.schoolId).subscribe(response =>{
    //   this.modules = response["modules"];
    // }, error =>{
    //   console.log(error);
    // });
  }

  getOrganizationSchools() {
    // this.homeService.getOrganizationSchools(this.schoolId).subscribe(response =>{
    //   this.schools = response["schools"];
    // }, error =>{
    //   console.log(error);
    // });
  }

  deleteOrganization() {}

  openDialog() {
    // let dialogRef = this.dialog.openDialog() openDialog(DeleteDialogComponent, {
    //   height: '400px',
    //   width: '600px',
    // });
  }
  didPressSearchButton() {
    console.log('didPressSearchButton');
  }
  logout() {
    this.auth.logout();
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  async timer(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async getTeacherQuestions() {
    // this.questionManager.getTeacherSearchQuestions('Math', 'Gr8', 5, 100, '').then((data : any) => {
    //   console.log('questions old')
    //   console.log(data)
    //   console.log(data.questions)

    //   this.questions = data.questions.rows

    // })
    // .catch((data) => {
    //   console.log(data)
    // })

    console.log('entered');
    this.http.get('assets/Book5.csv', { responseType: 'text' }).subscribe(
      async (data) => {
        let csvToRowArray = data.split('\n');
        // console.log(csvToRowArray)

        // console.log('entered11')

        for (let index = 1; index < csvToRowArray.length; index++) {
          let row = csvToRowArray[index].split(',');
          console.log(row);
          // ls.push({domain_id: row[4].substring(0, row[4].length -1), description: row[1]})
          if (row[1].includes('$')) {
            row[1] = row[1].toString().split('$').join(',');
          }
          console.log(row[4].substring(0, row[4].length - 1));
          console.log(Number(row[4].substring(0, row[4].length - 1)));
          console.log(row[1]);
          console.log('-------------------------------------');

          this.questionManager
            .getUnsavedLS(
              Number(row[4].substring(0, row[4].length - 1)),
              row[1]
            )
            .then((data: any) => {
              console.log('accept');
            })
            .catch((data) => {
              this.ls.push(row);
              console.log('reject');
              console.log(row);
            });
        }
      },
      (error) => {
        console.log(error);
      }
    );

    // this.http.get('assets/test.csv', {responseType: 'text'})
    // .subscribe(
    //     async data => {
    //         let csvToRowArray = data.split("\n");

    //         for (let index = 1; index < csvToRowArray.length ; index++) {
    //           let row = csvToRowArray[index].split(",");

    //           this.grades.push({lsId: row[0], grade: row[1], subject: row[2], curriculum: row[3]})
    //         }
    //         // console.log(this.answers);
    //     },
    //     error => {
    //         console.log(error);
    //     }
    // );
  }

  createQuestions() {
    console.log(this.ls);
    // new AngularCsv(this.ls, 'My Report');
  }

  datat() {
    // console.log(this.domainLS)
    //   let temp = []
    //   for(let i =0; i < 100; i++){
    //     temp.push(this.nationalities[i].country_code)
    //   }
    //   console.log(temp)
  }
}

//elevation: height from sea

//y,bMSUwr\PEW">K}N"LSc9aH(v~=$d]Mt
