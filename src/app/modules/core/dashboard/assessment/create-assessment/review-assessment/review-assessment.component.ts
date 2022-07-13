import { Component, OnInit } from '@angular/core';
import { Assessment } from 'src/app/modules/Models/Assessment';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { DialogCustomComponent } from 'src/app/modules/_dialogs/shared/dialog-custom/dialog-custom.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { DatePipe } from '@angular/common';
import { Section } from 'src/app/modules/Models/Section';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-review-assessment',
  templateUrl: './review-assessment.component.html',
  styleUrls: ['./review-assessment.component.css']
})
export class ReviewAssessmentComponent implements OnInit {

  assessment: any;
  selectedQuestions: any[] = [];
  time: any;
  averageDifficulty: number = 0;
  selectedSections: Section[] = [];
  randomOrder: boolean = false;

  isDragging: BehaviorSubject<any> = new BehaviorSubject<any>(false);


  className: string = '';
  constructor(private assessmentManagerService: AssessmentManagerService,
              private dialog: DialogServiceService,
              public datepipe: DatePipe, private router: Router,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const asst = this.assessmentManagerService.newAssessment$.getValue();
    const questions = this.assessmentManagerService.questions$.getValue();
    const questionTime = this.assessmentManagerService.time$.getValue()
    const sections = this.assessmentManagerService.selectedSections$.getValue();
    console.log(asst)
    console.log(questions)
    console.log(questionTime)
    console.log(sections)
    if(asst != null || questions != null || questionTime != null || sections != null){
      console.log('entered')
      this.assessment = asst;


      console.log(this.assessment)
    const s = this.assessment.startsAtDateTime +
    'T' +
    this.assessment.startTime;

    this.assessment.startDate = new Date(s).toISOString();

    const e =  this.assessment.endsAtDateTime +
    'T' +
    this.assessment.endTime;
    this.assessment.endDate = new Date(e).toISOString();



      //date format
      this.assessment.startDate = this.datepipe.transform(this.assessment.startDate, 'dd-MM-yyyy hh:mm a');
      this.assessment.endDate = this.datepipe.transform(this.assessment.endDate, 'dd-MM-yyyy hh:mm a');

      //average difficulty
      this.selectedQuestions = questions

      let difficulty = 0;
      let count = 0;
      for(let question of this.selectedQuestions){
        difficulty = difficulty + question.difficulty;
        count = count + 1;
      }
      this.averageDifficulty = Number((difficulty/count).toFixed(2));

      //time
      this.time = questionTime;

      //class and sections
      this.selectedSections = sections;

      let secs = this.selectedSections[0].code;
      for(let i = 1; i< this.selectedSections.length; i++){
        secs = secs + ',' + this.selectedSections[i].code;
      }

      this.className = this.assessment.selectedClass.code + ' ' + secs;


    }












    // const asst = this.assessmentManagerService.newAssessment$.getValue();
    // const questions = this.assessmentManagerService.questions$.getValue();
    // const questionTime = this.assessmentManagerService.time$.getValue()
    // const sections = this.assessmentManagerService.selectedSections$.getValue();
    // console.log(asst)
    // console.log(questions)
    // if(asst != null || questions != null || questionTime != null || sections != null){
      // console.log('entered')
      // this.assessment = asst;
      // const startDate = new Date(this.assessment.startDate);
      // const endDate = new Date(this.assessment.endDate);

      // //date format
      // this.assessment.startDate = this.datepipe.transform(startDate, 'dd-MM-yyyy hh:mm a');
      // this.assessment.endDate = this.datepipe.transform(endDate, 'dd-MM-yyyy hh:mm a');

      //average difficulty
      // this.selectedQuestions = questions

      // let difficulty = 0;
      // for(let question of this.selectedQuestions){
      //   difficulty = difficulty + question.difficulty;
      // }
      // this.averageDifficulty = Number((difficulty/this.selectedQuestions.length).toFixed(2));

      // //time
      // this.time = questionTime;

      // //class and sections
      // this.selectedSections = sections;

      // let secs = this.selectedSections[0].code;
      // for(let i = 1; i< this.selectedSections.length; i++){
      //   secs = secs + ',' + this.selectedSections[i].code;
      // }

      // this.className = this.assessment.selectedClass.name + ' ' + secs;


    // }
  }

  checkFinish(questions: any[]){
    let check = true;
    let negative = false;

    for(let question of questions){
      if(question.mark == undefined || question.mark.length == 0){
        check = false;
      }
      if(Number(question.mark <= 0 )){
        negative = true;
      }
    }
    if(check){
      if(this.selectedQuestions.length == 0){
        this.dialog.openDialog({
          title: 'Please choose at least one question',
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
              //call delete assessment API
          }
        });
      }
      else if(negative == true){
        this.dialog.openDialog({
          title: 'You cannot add a negative mark or zero mark.',
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {
              //call delete assessment API
          }
        });
      }
      else{
        this.createAssessment();

      }
    }
    else{
      //the user doesnt enter all the grades
      this.dialog.openDialog({
        title: 'Please fill the questions\' marks',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
            //call delete assessment API
        }
      });
    }


  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event)
    console.log(this.selectedQuestions)
    moveItemInArray(this.selectedQuestions, event.previousIndex, event.currentIndex);
  }

  createAssessment() {
    console.log(this.assessment)
    const s = this.assessment.startsAtDateTime +
    'T' +
    this.assessment.startTime;

    this.assessment.startDate = new Date(s).toISOString();

    const e =  this.assessment.endsAtDateTime +
    'T' +
    this.assessment.endTime;
    this.assessment.endDate = new Date(e).toISOString();
    const from = new DatePipe('en-Us').transform(this.assessment.startDate, 'dd MMM yyyy hh:mm a');
    const to = new DatePipe('en-Us').transform(this.assessment.endDate, 'dd MMM yyyy hh:mm a');
    this.assessment.from_date = from
    this.assessment.to_date = to
    this.assessment.class = this.assessment.selectedClass
    this.assessment.random = this.randomOrder

    console.log(this.assessment.startDate)
    console.log(this.assessment.endDate)

      this.assessmentManagerService
      .createAssessmentDittofi(this.assessment, this.selectedSections)
      .then((res: any) => {
        console.log(res);

        this.assessment.id = res.data.Id;
        this.assessment.status = 'pending'
        this.assessment.createdAt = new Date().toISOString();
        this.assignQuestionsToAssessment()

      })
      .catch((res) => {
        console.log(res)
        let finalErr = 'Internal Server Error'
        if(res.error != undefined){
          finalErr = res.error.message;
        }
        console.log(res);

        console.log(res.error.message);
        this.dialog.openDialog({
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

  assignQuestionsToAssessment(){
    console.log(this.assessment)
    console.log(this.selectedQuestions)
    this.assessmentManagerService.assignQuestionsToAssessmentDittofi(this.assessment.id, this.selectedQuestions, this.randomOrder).then((res: any) => {
      console.log(res)
      const newAsst = this.assessmentManagerService.newAssessment$.getValue();
      newAsst.startsAtDateTime = newAsst.startDate
      newAsst.endsAtDateTime = newAsst.endDate


      // console.log(this.assessmentManagerService.viewAssessementsObject$.getValue())
      // if(this.assessmentManagerService.viewAssessementsObject$.getValue() != null ||
      // this.assessmentManagerService.viewAssessementsObject$.getValue() != undefined){
      //   this.assessmentManagerService.viewAssessementsObject$.getValue().assessments.push(newAsst);
      // }


      this.assessmentManagerService.finishedAsst$.next(true);
      this.dialog.openDialog({
        title: 'Your assessment is now ready to be published',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
          this.router.navigate(['/assessment/viewAssessments']);
        }
      });
    }).catch((res) => {
      console.log(res)

      let finalErr = 'Internal Server Error'
      if(res.error.error != undefined){
        finalErr = res.error.error.message;
      }
      console.log(res);

      console.log(res.error.error.message);
      this.dialog.openDialog({
        title: finalErr,
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {

        }
      });

      console.log(res);
    })
  }

  removeQuestion(index){
    this.selectedQuestions.splice(index, 1);
  }
  htmlToAnswer(text){
    const t = this.sanitizer.bypassSecurityTrustHtml(
      this.analyzeQuestionText(text)
    );
    return t;
  }

  analyzeQuestionText(questionText: string) {
    const questionArray = questionText.split(' ');
    let newQuestion = '';
    console.log(questionArray);
    for (let letter of questionArray) {
      if (letter.includes('{$$') && letter.includes('$$}')) {
        const imageName = letter.replace('{$$', '').replace('$$}', '');
        const newImage = '<img src="' + imageName + '" />';

        newQuestion = newQuestion + newImage + ' ';
      } else {
        newQuestion = newQuestion + letter + ' ';
      }
    }

    return newQuestion;
  }

  containsNBSP(questionText : string){

    if(questionText == undefined || questionText == ''){
      return false
    }
    else if(questionText.includes('&nbsp')){
      return true;
    }
    else{
      return false;
    }
  }
}
