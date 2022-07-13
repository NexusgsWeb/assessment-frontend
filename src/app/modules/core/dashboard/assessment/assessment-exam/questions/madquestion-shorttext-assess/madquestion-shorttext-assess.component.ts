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
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-shorttext-assess',
  templateUrl: './madquestion-shorttext-assess.component.html',
  styleUrls: ['./madquestion-shorttext-assess.component.css'],
})
export class MadquestionShorttextAssessComponent implements OnInit {
  TIME_SPENT_ON_QUESTION = 0;
  didSubmit = false;
  @Input() isDisabled = false;
  @Input() QuestionDetails;
  @Input() AssessmentMetaData;
  questionAns: string = ''
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter Your Answer Here',
    translate: 'no',
    sanitize: false,
    fonts: [
      { class: 'Raleway', name: 'Raleway' },
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Raleway',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

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
    if (this.QuestionDetails.answers.length === 0) {
      // this.dialogService.openDialog({
      //   title:
      //     'There was an error loading your question.. please recreate another one..',
      //   message:
      //     'There was an error loading your question.. please recreate another one..',
      //   confirmText: 'Ok',
      //   cancelText: 'No',
      //   oneButton: true,
      //   DidConfirm: () => {},
      // });
      this.QuestionDetails.answers.push({
        AnswerText: '',
      });
    }
    else{
      let temp = this.assessmentManager.assessmentQuestionsAnswers$.getValue();
      for(let ans of temp){
        if(ans.id == this.QuestionDetails.id){
          this.questionAns = ans.answer
        }

    }
    }
  }
  TriggerTimer() {
    if (this.didSubmit || this.isDisabled) return;
    setTimeout(() => {
      this.TIME_SPENT_ON_QUESTION++;
      this.TriggerTimer();
    }, 1000);
  }

  destroyQuestion() {
    this.TIME_SPENT_ON_QUESTION = 0;
    this.didSubmit = true;
    this.host.nativeElement.remove();
  }
  confirmAnswer() {
    //Validation
      if (this.questionAns === '') {
        this.dialogService.openDialog({
          title: 'Make sure all fields are filled.',
          message: 'Make sure all fields are filled.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
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

    let temp = {id: this.QuestionDetails.id, answer: this.questionAns}
    let isFound = this.assessmentManager.assessmentQuestionsAnswers$.getValue()
    .findIndex((item) => item.id == this.QuestionDetails.id)
    if(isFound == -1){
      this.assessmentManager.assessmentQuestionsAnswers$.getValue().push(temp);
    }
    else{
      this.assessmentManager.assessmentQuestionsAnswers$.getValue()[isFound] = temp
    }

    for (let i = 0; i < 1; i++) {
      SubmitAnswerObject.answers.push({
        assessmentQuestionId: this.QuestionDetails.id,
        answerValue: this.questionAns,
        answerValueType: 'Text',
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
