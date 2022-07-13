import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { truncate } from 'fs';
import { BehaviorSubject } from 'rxjs';
import { answer } from 'src/app/modules/Models/answer';
import { question } from 'src/app/modules/Models/question';
import { QuestionSettingsDialogComponent } from 'src/app/modules/_dialogs/question-settings-dialog/question-settings-dialog.component';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { RemarksmanagerService } from 'src/app/modules/_services/remarksmanager.service';
import { Location } from '@angular/common';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-madquestion-blanks',
  templateUrl: './madquestion-blanks.component.html',
  styleUrls: ['./madquestion-blanks.component.css'],
})
export class MADQuestionBlanksComponent implements OnInit {
  @Input() ScrollID = null;

  didSubmitQuestion: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  EditMode = true;
  MetaData: any = {};
  QuestionInput = '';
  NumberOfBlankSpaces: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  BlankAnswers: answer[] = [
    // { id: 0, Answers: [] },
    // { id: 1, Answers: [] },
    // { id: 2, Answers: [] },
  ];

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
  userType = ''
  EditorToggle: boolean = false

  modified: boolean = false;

  selectedQuestion: any;
  edit: boolean = false

  RemarkFieldModel = '';
  RemarksList: any = [];
  class: any;
  grade: ''

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


  async ngOnInit(): Promise<void> {
    this.userType = this.authManager.getTypeOfUser()
    this.selectedQuestion = this.createQuestionService.selectedQuestion
    console.log("classes classes")
    this.class = this.createQuestionService.SelectedClass;
    console.log(this.class)
    if(this.createQuestionService.selectedQuestion != undefined){
      this.edit = this.selectedQuestion.edit;
      this.selectedQuestion = this.createQuestionService.selectedQuestion.question;
      this.QuestionInput = this.selectedQuestion.questionText;
      this.BlankAnswers = this.selectedQuestion.answers

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

    }
  }
  handleEditorToggle() {
    this.EditorToggle = !this.EditorToggle;
  }
  handleEditMode() {
    if (this.countBlankSpaces() === this.BlankAnswers.length) {
      console.log('no need');
      return;
    }
    this.BlankAnswers = [];

    for (let i = 0; i < this.countBlankSpaces(); i++) {
      this.BlankAnswers.push({
        answerText: '',
        isCorrect: true,
      });
    }
  }

  ConfirmBlanks() {
    return this.countBlankSpaces();
  }
  didOpenSettings() {
    this.class = this.createQuestionService.SelectedClass;
    const subject = this.createQuestionService.SelectedSubject;
    console.log(this.class)
    if(this.class == undefined || this.class.code == "No Curriculum" || subject == undefined || this.class == null || subject == null){
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
  addRemark() {
    const TestRemark = {
      remark: this.RemarkFieldModel,
    };
    this.remarkManager
      .addRemarksForQuestionDittofi(this.selectedQuestion.id, TestRemark)
      .then((res : any) => {
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
            this.didSubmitQuestion.next(true);
            this.location.back();
          }
        });

      });
  }

  addBlankSpace() {
    console.log("entered")
    this.QuestionInput = this.QuestionInput.concat(" [blank] ");
    this.BlankAnswers.push({
      answerText: '',
      isCorrect: true,
    });
  }
  countBlankSpaces() {
    return this.countOccurences(this.QuestionInput, '[blank]');
  }
  countOccurences(string, word) {
    return string.split(word).length - 1;
  }
  AnswerInput(answer) {
    console.log(this.BlankAnswers);

    console.log(answer);
  }
  RequestDeleteQuestion() {
    this.createQuestionService.oneQuestion.next(false)
    this.host.nativeElement.remove();
  }
  onFocus() {
    this.EditMode = true;
  }
  onBlur() {
    this.handleEditMode();
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
    this.EditMode = false;

    if (this.BlankAnswers.length === 0) {
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
    for (let i = 0; i < this.countBlankSpaces(); i++) {
      if (this.BlankAnswers[i].answerText.length === 0) {
        this.dialogService.openDialog({
          title: 'Make sure all inputs are satisfied and try again.',
          message: 'Make sure all inputs are satisfied and try again..',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }

    const QuestionToBeCreated: question = {
      questionText: this.QuestionInput,
      questionType: 'FillInTheBlanks',
      answers: this.BlankAnswers,
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
                this.didSubmitQuestion.next(true);
                this.location.back();
              }
            });
          });
      },
    });
    console.log(QuestionToBeCreated);
  }

  editQuestion() {
    this.EditMode = false;

    if (this.BlankAnswers.length === 0) {
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
    for (let i = 0; i < this.countBlankSpaces(); i++) {
      if (this.BlankAnswers[i].answerText.length === 0) {
        this.dialogService.openDialog({
          title: 'Make sure all inputs are satisfied and try again.',
          message: 'Make sure all inputs are satisfied and try again..',
          confirmText: 'Ok',
          oneButton: true,
          cancelText: 'No',
          DidConfirm: () => {},
        });
        return;
      }
    }

    const QuestionToBeCreated: question = {
      questionText: this.QuestionInput,
      questionType: 'FillInTheBlanks',
      answers: this.BlankAnswers,
    };
    this.dialogService.openDialog({
      title: 'Are you sure you want to edit this Question?',
      message: 'Are you sure you want to edit this Question?',
      confirmText: 'Yes',
      oneButton: false,
      cancelText: 'No',
      DidConfirm: () => {
        this.QuestionBankService.editQuestionDittofi(this.selectedQuestion.id, QuestionToBeCreated, this.MetaData)
          .then(async (res: any) => {
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
                this.didSubmitQuestion.next(true);
                this.location.back();
              }
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

  deleteBlank(index){
    console.log(index)
    this.BlankAnswers.splice(index, 1);

    const splittedText = this.QuestionInput.split(' ')
    console.log(splittedText)

    console.log('--------------------------------')
    let blankCount = 0;
    let count = splittedText.length;

    let tempArray = []
    for(let i = 0; i< count; i++){
      console.log(splittedText[i])
      if(splittedText[i] == '[blank]'){
        blankCount = blankCount + 1;
        if(index != (blankCount - 1)){
          tempArray.push(splittedText[i])
        }

      }
      else{
        tempArray.push(splittedText[i])
      }
    }

    console.log(tempArray)
    this.QuestionInput = tempArray.join(' ')
    console.log(this.QuestionInput)

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
    this.QuestionInput = tempString
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
