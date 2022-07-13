import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs'
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

export let browserRefresh = false;

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.css'],
})
export class IntroPageComponent implements OnInit {
  Resume;
  @Input() ExamMetaData;
  @Output() ExamQuestionStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() ExamQuestionResume: EventEmitter<any> = new EventEmitter<any>();
  subscription: Subscription;
  constructor(private router: Router, private ActivatedRoute: ActivatedRoute,
    private assessmentManager: AssessmentManagerService, private dialogService: DialogServiceService , private authManager: AuthManagerService) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    console.log('called1')

    console.log(this.ExamMetaData.getValue())
    console.log(this.ActivatedRoute.snapshot.queryParams['resume']);
    try {
      if (this.ActivatedRoute.snapshot.queryParams['resume'] == 'true') {
        console.log('yes');
        this.Resume = true;
      } else {
        console.log('no');

        this.Resume = false;
      }
    } catch (err) {
      console.log('ERROR?' + this.Resume);
      this.Resume = false;
    }

    console.log(this.ExamMetaData.getValue());
  }

  didClickStartExam() {

    this.assessmentManager.getAttemptsNumberDittofi(this.ActivatedRoute.snapshot.params['id'], this.authManager.getUserId()).then((item : any) => {
      console.log(item)
      let attempts = item.data.id
      if(attempts >= 1){
        this.dialogService.openDialog({
          title: 'You have reached the maximum number of attempts',
          message: 'You have reached the maximum number of attempts',
          confirmText: 'Return to main page',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {
            this.router.navigate(['/assessment/viewAssessments/student/']);
          }})
      }
      else{
        this.ExamQuestionStart.emit('START');
      }

    }).catch((item) => {
      console.log(item)
    })
    // let attempts = this.ExamMetaData.getValue().AssessmentMetaData.attempts_count

  }
  didClickResumeExam() {
    // this.assessmentManager.getAttemptsNumberDittofi(this.ActivatedRoute.snapshot.params['id'], this.authManager.getUserId()).then((item : any) => {
    //   let attempts = item.data.id
    //   if(attempts > 2){
    //   this.dialogService.openDialog({
    //     title: 'You have reached the maximum number of attempts',
    //     message: 'You have reached the maximum number of attempts',
    //     confirmText: 'Return to main page',
    //     oneButton: true,
    //     cancelText: 'No',
    //     DidConfirm: () => {
    //       this.router.navigate(['/assessment/viewAssessments/student/']);
    //     }})
    // }
    // else{
      this.ExamQuestionResume.emit('START');
    // }
    // }).catch((item) => {
    //   console.log(item)
    // })

  }
  didClickCancelExam() {
    this.router.navigate(['/assessment/viewAssessments/student/']);
    console.log('exam cancelled');
  }
}
