import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject, Subject } from 'rxjs';
import { answer } from 'src/app/modules/Models/answer';
import { question } from 'src/app/modules/Models/question';
import { QuestionSettingsDialogComponent } from 'src/app/modules/_dialogs/question-settings-dialog/question-settings-dialog.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { RemarksmanagerService } from 'src/app/modules/_services/remarksmanager.service';
import { Location } from '@angular/common';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-mcq',
  templateUrl: './madquestion-mcq.component.html',
  styleUrls: ['./madquestion-mcq.component.css'],
})
export class MADQuestionMCQComponent implements OnInit {
  @Input() isSingleChoiceMode = false;
  @Input() ScrollID = null;
  firstTime = true;
  didSubmitQuestion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  RequestDelete: Subject<any> = new Subject<any>();
  MCQAnswers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([

    {
      answerText: '',
      isCorrect: false,
    },
    {
      answerText: '',
      isCorrect: false,
    },
    {
      answerText: '',
      isCorrect: false,
    },
  ]);
  htmlContent;
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
  modified: boolean = false;
  grade = ''
  userType = ''

  RemarkFieldModel = '';
  RemarksList: any = [];
  selectedQuestion: any;
  edit: boolean = false
  constructor(
    private dialog: MatDialog,
    private createQuestionService: CreateQuestionServiceService,
    private QuestionBankService: QuestionmanagerService,
    private dialogService: DialogServiceService,
    private host: ElementRef<HTMLElement>,
    private remarkManager: RemarksmanagerService,
    private location: Location,
    private authManager: AuthManagerService
  ) {}

  async ngOnInit():  Promise<void> {
    this.userType = this.authManager.getTypeOfUser()
    this.selectedQuestion = this.createQuestionService.selectedQuestion
    if(this.createQuestionService.selectedQuestion != undefined){
      this.edit = this.selectedQuestion.edit;
      this.selectedQuestion = this.createQuestionService.selectedQuestion.question;
      this.htmlContent = this.selectedQuestion.question_text;
      this.MCQAnswers.next(this.selectedQuestion.answers)
      console.log(this.selectedQuestion)

      let tempLOs = []
      for(let lo of this.selectedQuestion.learning_standards){

        let temp = tempLOs.find((item) => item.id == lo.id);
        if(temp == undefined){
          tempLOs.push(lo.id);
        }
        // tempLOs.push(lo.LO.id)
      }

      let cur = 2;

      for(let ques of this.selectedQuestion.curriculum_questions){
        if(ques.curriculum_id == cur){
          this.grade = ques.grade_code
        }
      }
      console.log('grade grade')
      console.log(this.grade)
      console.log(this.selectedQuestion)

      // this.createQuestionService.SelectedClass.code

      let metaDataFinal = {
        answerKey: this.selectedQuestion.answer_key,
        bloomsTaxonomyId: this.selectedQuestion.blooms_taxonomy_id,
        curriculumId: this.selectedQuestion.curriculum[0].id,
        gradeCode: this.grade,
        learningObjectiveIds: tempLOs,
        subjectCode: this.createQuestionService.SelectedSubject.code
      }
      console.log(metaDataFinal)

      this.MetaData = metaDataFinal

      console.log('user id')
      console.log(this.authManager.getUserId())
      let tempRemarks = [];
      for(let remark of this.selectedQuestion.remarks){
        let temp = tempRemarks.find((item) => item.id == remark.id);
        if(temp == undefined && remark.id != null){
          tempRemarks.push(remark)
        }
      }
      console.log('remarks remarks')
      console.log(tempRemarks)
      this.RemarksList = tempRemarks;
    }
  }

  addRemark() {

    const TestRemark = {
      remark: this.RemarkFieldModel,
      created_by: this.authManager.getUserId()
    };
    console.log(TestRemark)
    this.remarkManager
      .addRemarksForQuestionDittofi(this.selectedQuestion.id, TestRemark)
      .then(async (res : any) => {
        console.log(res)
        res.data.name = this.authManager.getUserName()
        this.RemarksList.push(res.data);

        this.RemarkFieldModel = '';
        this.dialogService.openDialog({
          title: 'Your Remark has been added.',
          message: 'Your Remark has been added.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((res) => {
        console.log(res)

        let finalErr = 'Internal Server Error'
        if(res.error.error != undefined){
          finalErr = res.error.error.message;
        }
        console.log(res);

        console.log(res.error.error.message);
        this.dialogService.openDialog({
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

  handleEditorToggle() {
    this.EditorToggle = !this.EditorToggle;
  }
  deleteChoiceHandler(answer) {
    let Arr = this.MCQAnswers.getValue();
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
    const newArr = this.MCQAnswers.getValue().filter((a) => {
      return !(a === answer);
    });
    this.MCQAnswers.next(newArr);
  }
  RequestDeleteQuestion() {
    this.createQuestionService.oneQuestion.next(false)
    this.host.nativeElement.remove();
  }
  DidTriggerAnswer(elementChosen) {
    if (this.isSingleChoiceMode) {
      const Arr = this.MCQAnswers.getValue();
      Arr.forEach((element) => {
        if (element !== elementChosen) {
          element.isCorrect = false;
        }
      });
      this.MCQAnswers.next(Arr);
    }
  }
  didOpenSettings() {
    console.log(this.MetaData.los)
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
      var obj = {
        question: this.selectedQuestion,
        edit: this.edit,
        modified: this.modified,
        lo: this.MetaData.los,
        answerKey: this.MetaData.answerKey,
        bloomsTaxonomy: this.MetaData.bloomsTaxonomy,
        loMap: this.MetaData.loMap,
        domains: this.MetaData.domains,
        allLOs: this.MetaData.allLOs,
        CategoryOfLearnings: this.MetaData.CategoryOfLearnings,
        DimensionOfKnowledges: this.MetaData.DimensionOfKnowledges,
        allBlooms: this.MetaData.allBlooms,
        domainLoMap: this.MetaData.domainLoMap

      }
      this.dialog
        .open(QuestionSettingsDialogComponent, {data: obj})
        .afterClosed()
        .subscribe((res) => {
          console.log(res);

            this.modified = res.modified
            this.MetaData.loMap = res.loMap
            this.MetaData.bloomsTaxonomy = res.Taxonomy
            this.MetaData.bloomsTaxonomyId = res.Taxonomy.Id;
            this.MetaData.curriculumId = 2;
            this.MetaData.gradeCode =
              this.createQuestionService.SelectedClass.code + '';
            this.MetaData.difficulty = 1;
            this.MetaData.averageTime = 1;
            this.MetaData.subjectCode =
            this.createQuestionService.SelectedSubject.code + '';
            this.MetaData.domains = res.domains,
            this.MetaData.allLOs = res.allLOs,
            this.MetaData.CategoryOfLearnings = res.CategoryOfLearnings,
            this.MetaData.DimensionOfKnowledges = res.DimensionOfKnowledges
            this.MetaData.allBlooms = res.allBlooms
            this.MetaData.domainLoMap = res.domainLoMap

            console.log(res.LOs);
            let LOs = [];
            res.LOs.forEach((element) => {
              LOs.push(element.id);
            });
            console.log(LOs)
            this.MetaData.learningObjectiveIds = LOs;
            this.MetaData.los = res.LOs;
            this.MetaData.answerKey = res.answerKey;


        });
    }

  }
  @HostListener('click')
  public onMouseClick(e) {
    if (this.didSubmitQuestion.getValue()) {
      this.dialogService.openDialog({
        title: 'The Question is Locked. You can only preview it.',
        message: 'The Question is Locked. You can only preview it.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
    }
  }
  async didSave() {
    if (this.htmlContent === undefined || this.htmlContent.length <= 0) {
      this.dialogService.openDialog({
        title: 'Please fill the empty answers options',
        message: 'Please fill the empty answers options',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    const Ans = this.MCQAnswers.getValue();
    for (let i = 0; i < Ans.length; i++) {
      if (
        Ans[i].answerText === '' ||
        Ans[i].answerText === undefined ||
        Ans[i].answerText === null
      ) {
        this.dialogService.openDialog({
          title: 'Please fill the empty answers options',
          message: 'Please fill the empty answers options',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }
    if (Object.keys(this.MetaData).length === 0) {
      this.dialogService.openDialog({
        title: 'Please Set the Question MetaData',
        message: 'Please Set the Question MetaData',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    console.log(this.MetaData);
    if (this.didSubmitQuestion.getValue()) {
      return;
    }
    this.globalCollapser.next(true);
    this.EditorToggle = false;
    var isValid = false;
    let trueCount = 0;
    let duplicate = false;

    this.MCQAnswers.getValue().forEach((element: answer) => {
      if (element.isCorrect === true) {
        isValid = true;
      }
    });
    this.MCQAnswers.getValue().forEach((element: answer) => {
      if (element.isCorrect === true) {
        trueCount ++;
      }
    });

    for(let i =0; i< this.MCQAnswers.getValue().length; i++){
      for(let j = i+1; j < this.MCQAnswers.getValue().length; j++){
        if(this.MCQAnswers.getValue()[i] == this.MCQAnswers.getValue()[j]){
          duplicate = true
        }
      }
    }


    if(duplicate){
      this.dialogService.openDialog({
        title: 'There are duplicate options.',
        message: 'There are duplicate options.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }

    if(this.MCQAnswers.getValue().length <= 1){
      this.dialogService.openDialog({
        title: 'You have to put more than one option.',
        message: 'You have to put more than one option.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
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
    console.log(this.isSingleChoiceMode)
    console.log(this.MCQAnswers.getValue().length)
    if (this.isSingleChoiceMode == false) {
      if(trueCount < 2){
        this.dialogService.openDialog({
          title: 'Please select more than one answer.',
          message: 'Please select more than one answer.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
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
            questionText: this.htmlContent,
            questionType: 'SCQ',
            answers: this.MCQAnswers.getValue(),
          };
          this.QuestionBankService.createQuestionV2Dittofi(QuestionToBeCreated, this.MetaData, this.authManager.getUserId())
            .then(async (res: any) => {
              console.log(res.data);
              console.log('meta data is set..');
              this.host.nativeElement.remove();
              // await this.QuestionBankService.setQuestionMetaData(
              //   res.question.id,
              //   this.MetaData
              // )
              //   .then((res) => {

              //   })
              //   .catch((err) => {
              //     console.log(err)
              //     console.log(
              //       'question was created.. but meta data is not set..'
              //     );
              //   });
              this.dialogService.openDialog({
                title: 'The Question was created successfully',
                message: 'The Question was created successfully',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {
                  this.createQuestionService.oneQuestion.next(false);
                  this.didSubmitQuestion.next(true);
                },
              });
            })
            .catch((res) => {

              console.log(res)

              let finalErr = 'Internal Server Error'
              if(res.error.error != undefined){
                finalErr = res.error.error.message;
              }
              console.log(res);

              console.log(res.error.error.message);
              this.dialogService.openDialog({
                title: finalErr,
                message: 'test',
                confirmText: 'Okay',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {

                }
              });

            });
          console.log(QuestionToBeCreated);
        } else {
          const QuestionToBeCreated = {
            questionText: this.htmlContent,
            questionType: 'MCQ',
            answers: this.MCQAnswers.getValue(),
          };
          this.QuestionBankService.createQuestionV2Dittofi(QuestionToBeCreated, this.MetaData, this.authManager.getUserId())
            .then(async (res: any) => {
              console.log('meta data is set..');
                  this.host.nativeElement.remove();
              // await this.QuestionBankService.setQuestionMetaData(
              //   res.question.id,
              //   this.MetaData
              // )
              //   .then((res) => {

              //   })
              //   .catch((err) => {
              //     console.log(
              //       'question was created.. but meta data is not set..'
              //     );
              //   });
              console.log(res);
              this.dialogService.openDialog({
                title: 'The Question was created successfully',
                message: 'The Question was created successfully',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {
                  this.createQuestionService.oneQuestion.next(false);
                  this.didSubmitQuestion.next(true);
                },
              });
            })
            .catch((res) => {
              console.log(res)

              let finalErr = 'Internal Server Error'
              if(res.error.error != undefined){
                finalErr = res.error.error.message;
              }
              console.log(res);

              console.log(res.error.error.message);
              this.dialogService.openDialog({
                title: finalErr,
                message: 'test',
                confirmText: 'Okay',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {

                }
              });
            });
          console.log(QuestionToBeCreated);
        }
      },
    });
  }

  async editQuestion(){
    if (this.htmlContent === undefined || this.htmlContent.length <= 0) {
      this.dialogService.openDialog({
        title: 'Please fill the empty answers options',
        message: 'Please fill the empty answers options',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    const Ans = this.MCQAnswers.getValue();
    for (let i = 0; i < Ans.length; i++) {
      if (
        Ans[i].answerText === '' ||
        Ans[i].answerText === undefined ||
        Ans[i].answerText === null
      ) {
        this.dialogService.openDialog({
          title: 'Please fill the empty answers options',
          message: 'Please fill the empty answers options',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }
    if (Object.keys(this.MetaData).length === 0) {
      this.dialogService.openDialog({
        title: 'Please Set the Question MetaData',
        message: 'Please Set the Question MetaData',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    console.log(this.MetaData);
    if (this.didSubmitQuestion.getValue()) {
      return;
    }
    this.globalCollapser.next(true);
    this.EditorToggle = false;
    var isValid = false;
    var trueCount = 0;
    let duplicate = false;
    for(let i =0; i< this.MCQAnswers.getValue().length; i++){
      for(let j = i+1; j < this.MCQAnswers.getValue().length; j++){
        if(this.MCQAnswers.getValue()[i] == this.MCQAnswers.getValue()[j]){
          duplicate = true
        }
      }
    }


    this.MCQAnswers.getValue().forEach((element: answer) => {
      if (element.isCorrect === true) {
        isValid = true;
      }
    });

    this.MCQAnswers.getValue().forEach((element: answer) => {
      if (element.isCorrect === true) {
        trueCount ++;
      }
    });

    if(duplicate){
      this.dialogService.openDialog({
        title: 'There are duplicate options.',
        message: 'There are duplicate options.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }

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
    if (this.isSingleChoiceMode == false) {
      if(trueCount < 2){
        this.dialogService.openDialog({
          title: 'Please select more than one answer.',
          message: 'Please select more than one answer.',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }
    this.dialogService.openDialog({
      title: 'Are you sure you want to edit this Question?',
      message: 'Are you sure you want to edit this Question?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        if (this.isSingleChoiceMode) {
          const QuestionToBeCreated = {
            questionText: this.htmlContent,
            questionType: 'SCQ',
            answers: this.MCQAnswers.getValue(),
          };
          console.log(this.selectedQuestion.id)
          console.log(QuestionToBeCreated)
          this.QuestionBankService.editQuestionDittofi(this.selectedQuestion.id, QuestionToBeCreated, this.MetaData)
            .then(async (res: any) => {
              console.log(res.data);
              console.log('meta data is set..');
              this.host.nativeElement.remove();
              this.dialogService.openDialog({
                title: 'Success.. Question Edited.',
                message: 'Success.. Question Edited.',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {

                  this.didSubmitQuestion.next(true);
                  this.location.back();
                },
              });
            })
            .catch((res) => {
              console.log(res)

              let finalErr = 'Internal Server Error'
              if(res.error.error != undefined){
                finalErr = res.error.error.message;
              }
              console.log(res);

              console.log(res.error.error.message);
              this.dialogService.openDialog({
                title: finalErr,
                message: 'test',
                confirmText: 'Okay',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {

                }
              });
            });
          console.log(QuestionToBeCreated);
        } else {
          const QuestionToBeCreated = {
            questionText: this.htmlContent,
            questionType: 'MCQ',
            answers: this.MCQAnswers.getValue(),
          };
          this.QuestionBankService.editQuestionDittofi(this.selectedQuestion.id, QuestionToBeCreated, this.MetaData)
            .then(async (res: any) => {
              this.host.nativeElement.remove();

              this.dialogService.openDialog({
                title: 'The Question was edited successfully',
                message: 'The Question was edited successfully',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {
                  this.didSubmitQuestion.next(true);
                  this.location.back();
                },
              });
              console.log(res);

            })
            .catch((err) => {
              console.log(err)
              this.dialogService.openDialog({
                title: 'Make sure all inputs are satisfied and try again.',
                message: 'Make sure all inputs are satisfied and try again.',
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {},
              });
            });
          console.log(QuestionToBeCreated);
        }
      },
    });
  }

  async saveEditQ(){
    if(this.edit){
      await this.editQuestion()
    }
    else{
      await this.didSave()
    }
  }

  showText(event: string){
    console.log(event.includes('<li>'))
    let tempString = event
    let replacedString = /<li>/gi
    if(tempString.includes('<ul><li>')){
      console.log('entered')
      tempString = tempString.replace(replacedString, '<li style = "list-style-type: circle;">')
      console.log(tempString)

    }
    this.htmlContent = tempString
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
