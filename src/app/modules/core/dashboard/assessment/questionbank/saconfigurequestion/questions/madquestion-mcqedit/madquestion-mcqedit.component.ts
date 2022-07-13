import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject, Subject } from 'rxjs';
import { answer } from 'src/app/modules/Models/answer';
import { QuestionSettingsDialogComponent } from 'src/app/modules/_dialogs/question-settings-dialog/question-settings-dialog.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';

@Component({
  selector: 'app-madquestion-mcqedit',
  templateUrl: './madquestion-mcqedit.component.html',
  styleUrls: ['./madquestion-mcqedit.component.css'],
})
export class MADQuestionMCQEditComponent implements OnInit {
  @Input() isSingleChoiceMode = false;
  @Input() ScrollID = null;
  @Input() QuestionDetails;
  firstTime = true;
  didSubmitQuestion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  RequestDelete: Subject<any> = new Subject<any>();
  // When $a \\ne 0$, there are two solutions to $\\frac{5}{9}$

  globalCollapser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  EditorToggle = false;
  MetaData: any = {};
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
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
      {
        name: 'table',
        class: '<!--',
        tag: 'table class="table"><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table> <!-- ',
      },
    ],
  };

  constructor(
    private dialog: MatDialog,
    private createQuestionService: CreateQuestionServiceService,
    private QuestionBankService: QuestionmanagerService,
    private dialogService: DialogServiceService,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log(this.QuestionDetails.answers);
    console.log(this.QuestionDetails);
  }

  handleEditorToggle() {
    this.EditorToggle = !this.EditorToggle;
  }
  deleteChoiceHandler(answer) {
    let Arr = this.QuestionDetails.answers;
    if (Arr.length === 1) {
      this.dialogService.openDialog({
        title: 'Cannot delete last the only choice.',
        message: 'Cannot delete last the only choice.',
        confirmText: 'Yes',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    console.log(answer);
    const newArr = this.QuestionDetails.answers.filter((a) => {
      return !(a === answer);
    });
    this.QuestionDetails.answers = newArr;
  }
  RequestDeleteQuestion() {
    this.host.nativeElement.remove();
  }
  DidTriggerAnswer(elementChosen) {
    if (this.isSingleChoiceMode) {
      const Arr = this.QuestionDetails.answers;
      Arr.forEach((element) => {
        if (element !== elementChosen) {
          element.isCorrect = false;
        }
      });
      this.QuestionDetails.answers = Arr;
    }
  }
  didOpenSettings() {
    const cls = this.createQuestionService.SelectedClass;
    const subject = this.createQuestionService.SelectedSubject;
    console.log(cls)
    if(cls == undefined || cls.code == "No Curriculum" || subject == undefined || cls == null || subject == null){
      this.dialogService.openDialog({
        title: 'Please select a class and a subject',
        message: 'Please select a class and a subject',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    else{
    this.dialog
      .open(QuestionSettingsDialogComponent)
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        this.MetaData.bloomsTaxonomyId = res.Taxonomy.id;
        this.MetaData.curriculumId = 2;
        this.MetaData.gradeCode =
          this.createQuestionService.SelectedClass.code + '';
        this.MetaData.difficulty = 1;
        this.MetaData.averageTime = 1;
        this.MetaData.subjectCode =
          this.createQuestionService.SelectedSubject.code + '';
        console.log(res.LOs);
        let LOs = [];
        res.LOs.forEach((element) => {
          LOs.push(element.id);
        });
        this.MetaData.learningObjectiveIds = LOs;
        this.MetaData.answerKey = res.answerKey;
      });
    }
  }
  async didSave() {
    if (
      this.QuestionDetails.questionText === undefined ||
      this.QuestionDetails.questionText.length <= 0
    ) {
      this.dialogService.openDialog({
        title: 'Please Fill In the Question Text and the Answers Text',
        message: 'Please Fill In the Question Text and the Answers Text',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    const Ans = this.QuestionDetails.answers;
    for (let i = 0; i < Ans.length; i++) {
      if (
        Ans[i].answerText === '' ||
        Ans[i].answerText === undefined ||
        Ans[i].answerText === null
      ) {
        this.dialogService.openDialog({
          title: 'Please Fill In the Question Text and the Answers Text',
          message: 'Please Fill In the Question Text and the Answers Text',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }
    // if (Object.keys(this.MetaData).length === 0) {
    //   this.dialogService.openDialog({
    //     title: 'Please Set the Question MetaData',
    //     message: 'Please Set the Question MetaData',
    //     confirmText: 'Ok',
    //     oneButton: true,
    //     cancelText: 'No',
    //     DidConfirm: () => {},
    //   });
    //   return;
    // }
    console.log(this.MetaData);

    this.globalCollapser.next(true);
    this.EditorToggle = false;
    var isValid = false;
    this.QuestionDetails.answers.forEach((element: answer) => {
      if (element.isCorrect === true) {
        isValid = true;
      }
    });
    if (!isValid) {
      this.dialogService.openDialog({
        title: 'Make sure you have atleast one correct choice.',
        message: 'Make sure you have atleast one correct choice.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    this.dialogService.openDialog({
      title: 'Are you sure you want to create this Question?',
      message: 'Are you sure you want to create this Question?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        if (this.isSingleChoiceMode) {
          const QuestionToBeCreated = {
            questionText: this.QuestionDetails.questionText,
            questionType: 'SCQ',
            answers: this.QuestionDetails.answers,
          };
          this.QuestionBankService.editQuestionDittofi(
            this.QuestionDetails.id,
            QuestionToBeCreated,
            this.MetaData
          )
            .then((res) => {
              this.dialogService.openDialog({
                title: 'Question Edited Successfully',
                message: 'Question Edited Successfully',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {},
              });
            })
            .catch((err) => {
              this.dialogService.openDialog({
                title: 'There was a problem editing your question',
                message: 'There was a problem editing your question',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {},
              });
            });
          // this.QuestionBankService.createQuestion(QuestionToBeCreated)
          //   .then(async (res: any) => {
          //     console.log(res.question.id);
          //     await this.QuestionBankService.setQuestionMetaData(
          //       res.question.id,
          //       this.MetaData
          //     )
          //       .then((res) => {
          //         console.log('meta data is set..');
          //         this.host.nativeElement.remove();
          //       })
          //       .catch((err) => {
          //         console.log(
          //           'question was created.. but meta data is not set..'
          //         );
          //       });
          //     this.dialogService.openDialog({
          //       title: 'The Question was created successfully',
          //       message: 'The Question was created successfully',
          //       confirmText: 'Ok',
          //       oneButton: true,
          //       cancelText: 'No',
          //       DidConfirm: () => {
          //         this.didSubmitQuestion.next(true);
          //       },
          //     });
          //   })
          //   .catch((err) => console.log(err));
          console.log(QuestionToBeCreated);
        } else {
          const QuestionToBeCreated = {
            questionText: this.QuestionDetails.questionText,
            questionType: 'MCQ',
            answers: this.QuestionDetails.answers,
          };
          this.QuestionBankService.editQuestionDittofi(
            this.QuestionDetails.id,
            QuestionToBeCreated,
            this.MetaData
          )
            .then((res) => {
              this.dialogService.openDialog({
                title: 'Question Edited Successfully',
                message: 'Question Edited Successfully',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {},
              });
            })
            .catch((err) => {
              this.dialogService.openDialog({
                title: 'There was a problem editing your question',
                message: 'There was a problem editing your question',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {},
              });
            });
          // this.QuestionBankService.createQuestion(QuestionToBeCreated)
          //   .then(async (res: any) => {
          //     await this.QuestionBankService.setQuestionMetaData(
          //       res.question.id,
          //       this.MetaData
          //     )
          //       .then((res) => {
          //         console.log('meta data is set..');
          //         this.host.nativeElement.remove();
          //       })
          //       .catch((err) => {
          //         console.log(
          //           'question was created.. but meta data is not set..'
          //         );
          //       });
          //     console.log(res);
          //     this.dialogService.openDialog({
          //       title: 'The Question was created successfully',
          //       message: 'The Question was created successfully',
          //       confirmText: 'Ok',
          //       oneButton: true,
          //       cancelText: 'No',
          //       DidConfirm: () => {
          //         this.didSubmitQuestion.next(true);
          //       },
          //     });
          //   })
          //   .catch((err) => {
          //     this.dialogService.openDialog({
          //       title: 'Make sure all inputs are satisfied and try again.',
          //       message: 'Make sure all inputs are satisfied and try again.',
          //       confirmText: 'Ok',
          //       oneButton: true,
          //       cancelText: 'No',
          //       DidConfirm: () => {},
          //     });
          //   });
          console.log(QuestionToBeCreated);
        }
      },
    });
  }
}
