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
  selector: 'app-madquestion-mcq-assess',
  templateUrl: './madquestion-mcq-assess.component.html',
  styleUrls: ['./madquestion-mcq-assess.component.css'],
})
export class MadquestionMcqAssessComponent implements OnInit {
  TIME_SPENT_ON_QUESTION = 0;
  didSubmit = false;
  @Input() isDisabled = false;
  @Input() QuestionDetails;
  @Input() AssessmentMetaData;

  @Output() QuestionDoneEmitter: EventEmitter<any> = new EventEmitter<any>();

  answers: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  submittedAnswer = [];
  constructor(
    private dialogService: DialogServiceService,
    private assessmentManager: AssessmentManagerService,
    private host: ElementRef<HTMLElement>,
    private authManager: AuthManagerService
  ) {}

  ngOnInit(): void {
    console.log('entered entered55')
    console.log(this.QuestionDetails)
    for(let answer of this.QuestionDetails.answers){
      answer.answerText = answer.answer_text
    }

    this.didSubmit = false;
    this.TIME_SPENT_ON_QUESTION = 0;
    this.TriggerTimer();
    this.answers.next(this.QuestionDetails.answers);
  }
  TriggerTimer() {
    if (this.didSubmit || this.isDisabled) return;
    this.QuestionDetails.answers = this.QuestionDetails.answers.filter((item) => item.question_id == this.QuestionDetails.id)

    setTimeout(() => {
      this.TIME_SPENT_ON_QUESTION++;
      console.log('time spent is ' + this.TIME_SPENT_ON_QUESTION);
      this.TriggerTimer();
    }, 1000);
  }
  printSubmittedAnswer() {
    console.log(this.submittedAnswer);
  }
  submitAnswer(answer) {
    console.log(this.QuestionDetails);
    console.log(answer)
    console.log(this.QuestionDetails.questionType)

    if (this.QuestionDetails.questionType === 'MCQ') {
      if (this.submittedAnswer.includes(answer)) {
        this.submittedAnswer.splice(this.submittedAnswer.indexOf(answer), 1);
        return;
      }
      this.submittedAnswer.push(answer);
    } else if (this.QuestionDetails.questionType === 'SCQ') {
      this.submittedAnswer = [];
      this.submittedAnswer.push(answer);
      const newArr = this.answers.getValue();
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i] === answer) continue;
        newArr[i].isSelected = false;
      }
    } else {
      console.log('an error occurred?');
    }
  }

  destroyQuestion() {
    this.host.nativeElement.remove();
  }
  confirmAnswer() {
    console.log(this.AssessmentMetaData.getValue());
    //Validation
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
    console.log(this.AssessmentMetaData.getValue());
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
        id: this.QuestionDetails.answers[i].id,
        assessmentQuestionId: this.QuestionDetails.id,
        answerValue: this.QuestionDetails.answers[i].answerText,
        answerValueType:
          this.QuestionDetails.questionType === 'MCQ'
            ? 'MCQ'
            : 'SCQ',
        durationInSec: this.TIME_SPENT_ON_QUESTION,
      });
    }
    /////
    console.log(state)
    console.log(SubmitAnswerObject)
    this.assessmentManager
      .SubmitStudentQuestionDittofi(state.id, SubmitAnswerObject)
      .then((res) => {
        console.log(res)
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
        console.log(this.AssessmentMetaData);
        console.log(SubmitAnswerObject);
        console.log(this.QuestionDetails);
      })
      .catch((err) => {
        console.log(err)
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
