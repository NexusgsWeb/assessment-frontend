import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject } from 'rxjs';
import { question } from 'src/app/modules/Models/question';
import { QuestionSettingsDialogComponent } from 'src/app/modules/_dialogs/question-settings-dialog/question-settings-dialog.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { RemarksmanagerService } from 'src/app/modules/_services/remarksmanager.service';
import { Location } from '@angular/common';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-tf',
  templateUrl: './madquestion-tf.component.html',
  styleUrls: ['./madquestion-tf.component.css'],
})
export class MADQuestionTFComponent implements OnInit {
  @Input() ScrollID = null;

  correctAnswer;
  MetaData: any = {};
  htmlContent = '';
  EditorToggle = false;
  content = '';
  firstTime = true;
  didSubmitQuestion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  userType = ''
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
    ],
  };

  modified: boolean = false;

  RemarkFieldModel = '';
  RemarksList: any = [];
  selectedQuestion: any;
  edit: boolean = false
  grade = ''
  constructor(
    private createQuestionService: CreateQuestionServiceService,
    private dialog: MatDialog,
    private host: ElementRef<HTMLElement>,
    private QuestionBankService: QuestionmanagerService,
    private dialogService: DialogServiceService,
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
      this.htmlContent = this.selectedQuestion.questionText;
      this.correctAnswer = this.selectedQuestion.answers.find((item) => {

        return item.isCorrect == true
      }).answerText
      if(this.correctAnswer == 'True'){
        this.correctAnswer = true
      }
      else{
        this.correctAnswer = false
      }
      console.log(this.correctAnswer)

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
          this.grade = ques.gradeCode
        }
      }
      console.log('grade grade')
      console.log(this.selectedQuestion)
      console.log(this.grade)


      let metaDataFinal = {
        answerKey: this.selectedQuestion.answer_key,
        bloomsTaxonomyId: this.selectedQuestion.blooms_taxonomy_id,
        curriculumId: this.selectedQuestion.curriculum[0].id,
        gradeCode: this.grade,
        learningObjectiveIds: tempLOs,
        subjectCode: this.createQuestionService.SelectedSubject.code
      }

      this.MetaData = metaDataFinal

      let tempRemarks = [];
      for(let remark of this.selectedQuestion.remarks){
        let temp = tempRemarks.find((item) => item.id == remark.id);
        if(temp == undefined && remark.id != null){
          tempRemarks.push(remark)
        }
      }
      this.RemarksList = tempRemarks;

      console.log(this.RemarksList)
      this.firstTime = false;
    }
  }

  addRemark() {
    const TestRemark = {
      remark: this.RemarkFieldModel,
    };
    this.remarkManager
      .addRemarksForQuestionDittofi(this.selectedQuestion.id, TestRemark)
      .then((res: any) => {
        console.log(res)
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
      .catch((err) => {
        this.dialogService.openDialog({
          title: 'There was an error adding your remark.',
          message: 'There was an error adding your remark.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  handleEditorToggle() {
    if (this.firstTime) {
      this.htmlContent = '';
      this.firstTime = false;
    }
    this.EditorToggle = !this.EditorToggle;
    console.log(this.EditorToggle);
  }

  submitAnswerTrue() {
    this.correctAnswer = true;
  }
  submitAnswerFalse() {
    this.correctAnswer = false;
  }
  RequestDeleteQuestion() {
    this.createQuestionService.oneQuestion.next(false)
    this.host.nativeElement.remove();
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
  didSave() {
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
    if (this.htmlContent === undefined || this.htmlContent.length <= 0) {
      this.dialogService.openDialog({
        title: 'Please insert value for Question Input.',
        message: 'Please insert value for Question Input.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    this.EditorToggle = false;

    if (this.correctAnswer === undefined || this.correctAnswer === undefined) {
      this.dialogService.openDialog({
        title: 'Select one correct choice..',
        message: 'Select one correct choice..',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    const QuestionToBeCreated: question = {
      questionText: this.htmlContent,
      questionType: 'T/F',
      answers: [
        { answerText: 'True', isCorrect: this.correctAnswer === true },
        { answerText: 'False', isCorrect: this.correctAnswer === false },
      ],
    };
    this.dialogService.openDialog({
      title: 'Are you sure you want to create this Question?',
      message: 'Are you sure you want to create this Question?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        this.QuestionBankService.createQuestionV2Dittofi(QuestionToBeCreated, this.MetaData, this.authManager.getUserId())
          .then(async (res: any) => {
            console.log('meta data is set..');
            this.host.nativeElement.remove();
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
          .catch((err) => {
            this.dialogService.openDialog({
              title: 'Make sure all inputs are satisfied and try again.',
              message: 'Make sure all inputs are satisfied and try again.',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {},
            });
          });
      },
    });
    console.log(QuestionToBeCreated);
  }
  didOpenSettings() {
    const cls = this.createQuestionService.SelectedClass;
    const subject = this.createQuestionService.SelectedSubject;
    console.log(cls)
    console.log(subject)
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
    else {
    console.log(this.MetaData.los)
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
      allBlooms: this.MetaData.allBlooms

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


  editQuestion() {

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
    if (this.htmlContent === undefined || this.htmlContent.length <= 0) {
      this.dialogService.openDialog({
        title: 'Please insert value for Question Input.',
        message: 'Please insert value for Question Input.',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    this.EditorToggle = false;

    if (this.correctAnswer === undefined || this.correctAnswer === undefined) {
      this.dialogService.openDialog({
        title: 'Select one correct choice..',
        message: 'Select one correct choice..',
        confirmText: 'Ok',
        oneButton: true,
        cancelText: 'No',
        DidConfirm: () => {},
      });
      return;
    }
    const QuestionToBeCreated: question = {
      questionText: this.htmlContent,
      questionType: 'T/F',
      answers: [
        { answerText: 'True', isCorrect: this.correctAnswer === true },
        { answerText: 'False', isCorrect: this.correctAnswer === false },
      ],
    };
    console.log('entered edit')
    console.log(this.MetaData)
    console.log(QuestionToBeCreated)
    this.dialogService.openDialog({
      title: 'Are you sure you want to edit this Question?',
      message: 'Are you sure you want to edit this Question?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        this.QuestionBankService.editQuestionDittofi(this.selectedQuestion.id, QuestionToBeCreated, this.MetaData)
          .then(async (res: any) => {
            console.log('meta data is set..');
            this.host.nativeElement.remove();
            this.dialogService.openDialog({
              title: 'Success.. Question Edited.',
              message: 'Success.. Question Edited.',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
                this.createQuestionService.oneQuestion.next(false);
                this.didSubmitQuestion.next(true);
                this.location.back()
              },
            });
          })
          .catch((err) => {
            this.dialogService.openDialog({
              title: 'Make sure all inputs are satisfied and try again.',
              message: 'Make sure all inputs are satisfied and try again.',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {},
            });
          });
      },
    });
    console.log(QuestionToBeCreated);
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
