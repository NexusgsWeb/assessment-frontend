import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-date-assess',
  templateUrl: './madquestion-date-assess.component.html',
  styleUrls: ['./madquestion-date-assess.component.css'],
})
export class MadquestionDateAssessComponent implements OnInit {
  YearArray: number[] = [];
  MinYear = -1000;
  MaxYear = 2050;
  DayInput;
  MonthInput;
  YearInput;

  TIME_SPENT_ON_QUESTION = 0;
  didSubmit = false;
  @Input() isDisabled = false;

  @Input() QuestionDetails;
  @Input() AssessmentMetaData;

  questionAns: string = ''

  @Output() QuestionDoneEmitter: EventEmitter<any> = new EventEmitter<any>();
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
    this.QuestionDetails.answers = this.QuestionDetails.answers.filter((item) => item.question_id == this.QuestionDetails.id)
    let temp = this.assessmentManager.assessmentQuestionsAnswers$.getValue();
      for(let ans of temp){
        if(ans.id == this.QuestionDetails.id){
          this.questionAns = ans.answer
        }
      }
    const newDate = this.questionAns.split('-');
    console.log(newDate);
    console.log(newDate.length);
    if (newDate.length != 3) {
      this.DayInput = 'Day';
      this.MonthInput = 'Month';
      this.YearInput = 'Year';
    } else {
      this.DayInput = newDate[0];
      this.MonthInput = newDate[1];
      this.YearInput = newDate[2];
    }
    for (let i = this.MinYear; i <= this.MaxYear; i++) {
      this.YearArray.push(i);
    }
  }
  TriggerTimer() {
    if (this.didSubmit || this.isDisabled) return;
    setTimeout(() => {
      this.TIME_SPENT_ON_QUESTION++;
      this.TriggerTimer();
    }, 1000);
  }
  onChange(event) {
    console.log(event);
  }
  destroyQuestion() {
    this.TIME_SPENT_ON_QUESTION = 0;
    this.didSubmit = true;
    this.host.nativeElement.remove();
  }
  confirmAnswer() {


    this.questionAns =
      this.DayInput + '-' + this.MonthInput + '-' + this.YearInput;
    //Validation
      if (
        this.questionAns ===
        'Day-Month-Year'
      ) {
        this.dialogService.openDialog({
          title: 'Please Insert a valid Date.',
          message: 'Please Insert a valid Date.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }

      let temp = {id: this.QuestionDetails.id, answer: this.questionAns}
      let isFound = this.assessmentManager.assessmentQuestionsAnswers$.getValue()
      .findIndex((item) => item.id == this.QuestionDetails.id)
      if(isFound == -1){
        this.assessmentManager.assessmentQuestionsAnswers$.getValue().push(temp);
      }
      else{
        this.assessmentManager.assessmentQuestionsAnswers$.getValue()[isFound] = temp
      }

    //MCQ, SCQ, T/F, Number, Date, Text, FillInTheBlanks, Descriptive
    const state = this.AssessmentMetaData.getValue();
    const SubmitAnswerObject = {
      attemptId: state.assessmentAttempt.id,
      studentId: this.authManager.getUserId(),
      curriculumQuestionId: this.QuestionDetails.cq_id,
      assessmentQuestionId: this.QuestionDetails.assessment_question_id,
      answers: [],
    };
    for (let i = 0; i < 1; i++) {
      SubmitAnswerObject.answers.push({
        assessmentQuestionId: this.QuestionDetails.id,
        answerValue: this.questionAns,
        answerValueType: 'Date',
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
    // this.QuestionDetails.cq.questions.answers[0].answerText;
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
