import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { BehaviorSubject } from 'rxjs';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit {
  @Input() AssessmentMetaData: BehaviorSubject<any>;
  @Input() ExamMetaData: BehaviorSubject<any>;
  @ViewChild('cd') elementRef: CountdownComponent;

  // Display = ""

  Timer = new BehaviorSubject<number>(0);
  StartTime = 0;
  dategotten = false;
 

  constructor(
    private dialogService: DialogServiceService,
    private assessment: AssessmentManagerService,
    private authManager: AuthManagerService
  ) {}

  async ngOnInit(): Promise<void> {
    // this.Timer.next(3600);
    console.log(this.AssessmentMetaData.getValue())
    this.ExamMetaData.getValue().Questions.questions = this.ExamMetaData.getValue().Questions;
    console.log(this.ExamMetaData.getValue())
  }
  onTimerFinished(e: Event) {
    if (e['action'] == 'done' && this.dategotten === true) {
      const ExamMetaData = this.AssessmentMetaData.getValue();
      console.log(ExamMetaData)
      let id = ExamMetaData.id
      if(id == undefined){
        id = ExamMetaData.assessment.id
      }
      this.assessment
        .endAssessmentDittofi(id, this.authManager.getUserId())
        .then((res) => {
          const ExamMetaData = this.ExamMetaData.getValue();
          ExamMetaData.ExamIsFinished = true;
          this.ExamMetaData.next(ExamMetaData);
        })
        .catch((err) => {
          this.dialogService.openDialog({
            title: 'There was an error ending your exam',
            message: 'There was an error ending your exam',
            confirmText: 'Ok',
            oneButton: true,
            cancelText: 'No',
            DidConfirm: () => {},
          });
        });
    }
  }
  async ngAfterViewInit() {
    console.log("entered entered")
    const examMeta = this.ExamMetaData.getValue();
    if (examMeta.isResuming) {
      console.log('u are resuming...');
      await this.assessment.getSystemTime().then((res: any) => {
        this.StartTime = res.systemTime;
      });
      var StartDate = new Date(this.StartTime);
      var EndDate = new Date(
        new Date(this.StartTime).setMinutes(
          new Date(this.StartTime).getMinutes() +
            (examMeta.AssessmentMetaData.testDurationInMinuets -
              Math.ceil(examMeta.TimeElapsed / 60))
        )
      );
      // EndDate.setMinutes(EndDate.getMinutes() + examMeta.AssessmentInfo.testDurationInMinuets);
      console.log(StartDate);
      console.log(Math.ceil(examMeta.TimeElapsed / 60));

      // console.log(examMeta)
      // const EndDate = new Date(this.StartTime).addHours(examMeta.AssessmentInfo.endsAtDateTime);

      this.Timer.next(
        ((EndDate.valueOf() - StartDate.valueOf()) / 1000 / 60) * 60
      );
    } else {
      console.log('u are NOT resuming...');
      console.log(examMeta.AssessmentMetaData);
      console.log();

      await this.assessment.getSystemTime().then((res: any) => {
        this.StartTime = res.systemTime;
      });
      var StartDate = new Date(this.StartTime);
      var EndDate = new Date(
        new Date(this.StartTime).setMinutes(
          new Date(this.StartTime).getMinutes() +
            examMeta.AssessmentMetaData.testDurationInMinuets
        )
      );
      // EndDate.setMinutes(EndDate.getMinutes() + examMeta.AssessmentInfo.testDurationInMinuets);
      console.log(StartDate);
      console.log(Math.ceil(examMeta.TimeElapsed / 60));

      // console.log(examMeta)
      // const EndDate = new Date(this.StartTime).addHours(examMeta.AssessmentInfo.endsAtDateTime);
      if (((EndDate.valueOf() - StartDate.valueOf()) / 1000 / 60) * 60 === 0) {
        const ExamMetaData = this.AssessmentMetaData.getValue();
        this.assessment
          .endAssessmentDittofi(ExamMetaData.id, this.authManager.getUserId())
          .then((res) => {
            const ExamMetaData = this.ExamMetaData.getValue();
            ExamMetaData.ExamIsFinished = true;
            this.ExamMetaData.next(ExamMetaData);
          })
          .catch((err) => {
            this.dialogService.openDialog({
              title: 'There was an error ending your exam',
              message: 'There was an error ending your exam',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {},
            });
          });
      }
      this.Timer.next(
        ((EndDate.valueOf() - StartDate.valueOf()) / 1000 / 60) * 60
      );
    }
    this.dategotten = true;
  }
}
