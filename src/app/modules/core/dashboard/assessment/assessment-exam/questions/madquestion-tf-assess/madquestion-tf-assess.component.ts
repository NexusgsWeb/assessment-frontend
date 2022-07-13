import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-tf-assess',
  templateUrl: './madquestion-tf-assess.component.html',
  styleUrls: ['./madquestion-tf-assess.component.css'],
})
export class MadquestionTfAssessComponent implements OnInit {
  TIME_SPENT_ON_QUESTION = 0;
  didSubmit = false;

  @Input() AssessmentMetaData;

  @Input() isDisabled = false;
  @Input() QuestionDetails;

  @Output() QuestionDoneEmitter: EventEmitter<any> = new EventEmitter<any>();

  submittedAnswer = [];

  constructor(
    private assessmentManager: AssessmentManagerService,
    private host: ElementRef<HTMLElement>,
    private dialogService: DialogServiceService,
    private authManager: AuthManagerService
  ) {}

  ngOnInit(): void {
    this.didSubmit = false;
    this.TIME_SPENT_ON_QUESTION = 0;
    this.TriggerTimer();
    let tempAns = this.QuestionDetails.answers.filter((item) => item.question_id == this.QuestionDetails.id)
    this.QuestionDetails.answers = tempAns
    if (this.QuestionDetails.answers.length != 2) {
      console.log('This Question is not constructed well..');
      this.dialogService.openDialog({
        title:
          'This Question is not constructed well. this may be an API Issue..',
        message:
          'This Question is not constructed well. this may be an API Issue..',
        confirmText: 'Ok',
        cancelText: 'No',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    if (
      this.QuestionDetails.answers[0].isSelected === undefined ||
      this.QuestionDetails.answers[1].isSelected === undefined
    ) {
      this.QuestionDetails.answers.forEach((element) => {
        element.isSelected = false;
      });
    }
    this.QuestionDetails.answers[0].answerText = 'True';
    this.QuestionDetails.answers[1].answerText = 'False';
  }
  TriggerTimer() {
    if (this.didSubmit || this.isDisabled) return;
    setTimeout(() => {
      this.TIME_SPENT_ON_QUESTION++;
      this.TriggerTimer();
    }, 1000);
  }

  submitAnswerTrue() {
    console.log('true selected');
    console.log('false selected');
    this.QuestionDetails.answers[0].isSelected = true;
    this.QuestionDetails.answers[1].isSelected = false;
    console.log(this.QuestionDetails.answers);
  }
  submitAnswerFalse() {
    this.QuestionDetails.answers[0].isSelected = false;
    this.QuestionDetails.answers[1].isSelected = true;
    console.log(this.QuestionDetails.answers);
  }
  destroyQuestion() {
    this.TIME_SPENT_ON_QUESTION = 0;
    this.didSubmit = true;
    this.host.nativeElement.remove();
  }
  confirmAnswer() {
    //Validation
    let AtleastOne = false;
    for (let i = 0; i < this.QuestionDetails.answers.length; i++) {
      if (this.QuestionDetails.answers[i].isSelected === true) {
        AtleastOne = true;
      }
    }
    if (AtleastOne === false) {
      this.dialogService.openDialog({
        title: 'Make sure atleast one answer is selected.',
        message: '',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }

    console.log(this.AssessmentMetaData);
    //MCQ, SCQ, T/F, Number, Date, Text, FillInTheBlanks, Descriptive
    const state = this.AssessmentMetaData.getValue();
    const SubmitAnswerObject = {
      attemptId: state.assessmentAttempt.id,
      studentId: this.authManager.getUserId(),
      curriculumQuestionId: this.QuestionDetails.cq_id,
      assessmentQuestionId: this.QuestionDetails.assessment_question_id,
      answers: [],
    };
    for (let i = 0; i < this.QuestionDetails.answers.length; i++) {
      if (this.QuestionDetails.answers[i].isSelected === false)
        continue;
      SubmitAnswerObject.answers.push({
        assessmentQuestionId: this.QuestionDetails.id,
        answerValue: this.QuestionDetails.answers[i].answerText,
        answerValueType: 'T/F',
        durationInSec: this.TIME_SPENT_ON_QUESTION,
      });
    }
    /////
    this.assessmentManager
      .SubmitStudentQuestionDittofi(state.id, SubmitAnswerObject)
      .then((res) => {
        //Question Stored Successfully..
        let temp = this.assessmentManager.answeredQuestions$.getValue()
        let found = temp.find((item) => item == this.QuestionDetails.id);
        if(found == undefined){
          temp.push(this.QuestionDetails.id)
        }
        this.assessmentManager.answeredQuestions$.next(temp);
        this.AssessmentMetaData.answered = this.assessmentManager.answeredQuestions$.getValue().length

        this.QuestionDoneEmitter.emit('QUESTION DONE GO TO NEXT');
        this.didSubmit = true;
        this.TIME_SPENT_ON_QUESTION = 0;
        console.log(SubmitAnswerObject);
      })
      .catch((err) => {
        console.log(SubmitAnswerObject);

        //There was an Error submitting your question
        this.dialogService.openDialog({
          title:
            'There was an error Submitting Your Question, Please Try Again.',
          message:
            'There was an error Submitting Your Question, Please Try Again.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        console.log('THERE WAS AN ERROR SUBMITTING YOUR QUESTION.');
      });
    // this.QuestionDetails.answers[0].answerText;
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
