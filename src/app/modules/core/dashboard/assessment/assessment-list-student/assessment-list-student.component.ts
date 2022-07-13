import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { DatePipe } from '@angular/common';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { browserRefresh } from 'src/app/app.component';

@Component({
  selector: 'app-assessment-list-student',
  templateUrl: './assessment-list-student.component.html',
  styleUrls: ['./assessment-list-student.component.css'],
})
export class AssessmentListStudentComponent implements OnInit {
  CurrentTime;
  currentPage = 1;
  AssessmentsMetaData;
  SubjectNames: any[] = [];
  AssessmentList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public browserRefresh: boolean;
  constructor(
    private subjectsService: SubjectsManagerService,
    private assessmentService: AssessmentManagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private DialogSerivce: DialogServiceService,
    private authManager: AuthManagerService

  ) {}



  async ngOnInit() {
    this.browserRefresh = browserRefresh;
    console.log('refreshed?:', browserRefresh);

    await this.assessmentService.getSystemTime().then((res: any) => {
      this.CurrentTime = res.systemTime;
    });
    await this.assessmentService.getStudentAssessmentsPerSubjectDittofi(this.authManager.getUserId(),
    this.authManager.getSchoolId(), this.authManager.getSectionId()).then((res: any) => {
      console.log(res)
      this.AssessmentsMetaData = res;
      for(let asst of res.data){
        asst.startsAtDateTime = asst.from_date
        asst.endsAtDateTime = asst.to_date
        asst.testDurationInMinuets = asst.duration
        asst.subjectTitle = asst.subject_name
        if(new Date(this.CurrentTime) < new Date(asst.startsAtDateTime))
        {
          asst.statues = 'Cannot Start'
        }
        else if(new Date(this.CurrentTime) > new Date(asst.endsAtDateTime)){
          asst.statues = 'Cannot Start'
        }
        else if(asst.attempts_count ==0){
          asst.statues = 'Not Started'
        }
        else {
          if(asst.is_completed == true){
            asst.statues = 'Completed'
          }
          else{
            asst.statues = 'Can Resume'
          }
          // else if(asst.attempts_count < 2){
          //   asst.statues = 'Can Resume'
          // }
          // else{
          //   asst.statues = 'Cannot Resume'
          // }
        }
      }
      var arr = res.data;
      var sortedAssessments = [];
      arr.forEach((element) => {

        var result = this.checkIfValidToStart(element);
        if (result === 'Start') {
          sortedAssessments.push(element);
        }
      });
      arr.forEach((element) => {

        var result = this.checkIfValidToStart(element);
        if (result === 'Resume') {
          sortedAssessments.push(element);
        }
      });

      let temp = []
      arr.forEach((element) => {
        var result = this.checkIfValidToStart(element);
        if (result !== 'Start' && result !== 'Resume') {
          temp.push(element)
        }
      });

      temp = temp.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      for(let elem of temp){
        sortedAssessments.push(elem);

      }



     for(let assessment of sortedAssessments){
      const dateStartDate = new Date(assessment.startsAtDateTime)
      const dateEndDate = new Date(assessment.endsAtDateTime)

      const from = new DatePipe('en-Us').transform(dateStartDate, 'dd MMM yyyy hh:mm a');
      const to = new DatePipe('en-Us').transform(dateEndDate, 'dd MMM yyyy hh:mm a');

      assessment.startsAtDateTime = from;
      assessment.endsAtDateTime = to;

     }
     this.AssessmentList.next(sortedAssessments);


      // console.log(sortedAssessments);
      // this.AssessmentList.next(sortedAssessments);
      // console.log(this.AssessmentList.getValue());
      // this.getSubjectNames(sortedAssessments);
    });
  }
  FindSubject(asstList :any[]) {
      for (var j = 0; j < asstList.length; j++) {
        const sub = this.SubjectNames.find((item) => {
          console.log(asstList[j].subjectID)
          console.log(item.id)
console.log('------------------------------------')
          return item.id == asstList[j].subjectID
        });
        if(sub != undefined){
          asstList[j].subjectTitle = sub.name;
        }

    }
    this.AssessmentList.next(asstList);
    console.log(this.AssessmentList.getValue())
  }
  getSubjectNames(asstList: any[]) {
    var IDSToBeSubmitted = [];
    const state = asstList;
    state.forEach((element) => {
      IDSToBeSubmitted.push(element.subjectID + '');
    });
    this.subjectsService
      .getSubjectsNameBulkDittofi(IDSToBeSubmitted)
      .then((res: any) => {
        this.SubjectNames = res;
        console.log(res);
        this.FindSubject(asstList);
      })
      .catch((res) => {
        console.log(res);


        let finalErr = 'Internal Server Error'
        if(res.error.error != undefined){
          finalErr = res.error.error.message;
        }
        console.log(res);

        console.log(res.error.error.message);
        this.DialogSerivce.openDialog({
          title: finalErr,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {

          }
        });

      });
  }
  didClickStart(assessment) {
    console.log(new Date(this.CurrentTime) > new Date(assessment.endsAtDateTime))
    console.log(new Date(this.CurrentTime) < new Date(assessment.startsAtDateTime))
    console.log('------------------------------------------------')
    if (
      new Date(this.CurrentTime) > new Date(assessment.endsAtDateTime) ||
      new Date(this.CurrentTime) < new Date(assessment.startsAtDateTime)
    ) {
      return 'Cannot Start';
    } else if (assessment.statues === 'Can Resume') {
      this.router.navigate(['./exam/' + assessment.id], {
        queryParams: {
          resume: true,
        },
        relativeTo: this.activatedRoute,
      });
      console.log('redirect to resume..');
    } else if (assessment.statues === 'Not Started') {
      this.router.navigate(['./exam/' + assessment.id], {
        queryParams: {
          resume: false,
        },
        relativeTo: this.activatedRoute,
      });
      return;
    } else {
      console.log('an error has occurred..');
      return;
    }
  }
  checkIfValidToStart(assessment) {
    // console.log(assessment.title)
    // console.log(assessment.startsAtDateTime)
    // console.log(assessment.endsAtDateTime)
    // console.log(this.CurrentTime)

    // console.log('-------------------------------------------')
    if (
      new Date(this.CurrentTime) > new Date(assessment.endsAtDateTime) ||
      new Date(this.CurrentTime) < new Date(assessment.startsAtDateTime)
    ) {
      return 'Cannot Start';
    } else if (assessment.statues === 'Can Resume') {
      return 'Resume';
    } else if (assessment.statues === 'Not Started') {
      return 'Start';
    } else {
      return '';
    }
  }
}
