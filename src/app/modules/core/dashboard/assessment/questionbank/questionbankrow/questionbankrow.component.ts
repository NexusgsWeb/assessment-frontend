import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewQuestionDialogComponent } from 'src/app/modules/_dialogs/assessment/view-question-dialog/view-question-dialog.component';
import { EventEmitter } from '@angular/core';
import { BreadcrumbModule } from 'angular-crumbs';
import { BehaviorSubject } from 'rxjs';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { question } from 'src/app/modules/Models/question';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { SAconfigurequestionComponent } from '../saconfigurequestion/saconfigurequestion.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionSettingsDialogSaComponent } from 'src/app/modules/_dialogs/question-settings-dialog-sa/question-settings-dialog-sa.component';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-questionbankrow',
  templateUrl: './questionbankrow.component.html',
  styleUrls: ['./questionbankrow.component.css'],
})
export class QuestionbankrowComponent implements OnInit {
  @Input() public isSelected;
  @Input() public UserType;
  @Input() public QuestionDetails: any;
  @Input() private SelectAllObservable: BehaviorSubject<boolean>;
  @Input() private allGrades: any;
  @Input() private subject: any;
  @Output() setMetadata: EventEmitter<any> = new EventEmitter();

  public Mode = 'unknown?';
  public isBeingEdited = false;
  private EditButtonVisibility = false;
  private approveButtonVisibility = false;
  private DeleteVisibility = false;
  private PublishUnPublishVisibility = false;
  private SelectionVisibility = false;
  //Emitters
  @Output() DidDeleteListener: EventEmitter<any> = new EventEmitter();
  @Output() DidSelectListener: EventEmitter<any> = new EventEmitter();
  constructor(
    public dialog: MatDialog,
    private DialogSerivce: DialogServiceService,
    private QuestionManager: QuestionmanagerService,
    private dialogManager: DialogServiceService,
    private matDialog: MatDialog,
    private createQuestionService : CreateQuestionServiceService,
    private router : Router,
    private activatedRoute : ActivatedRoute, 
     private authManager: AuthManagerService

  ) {}

  ngOnInit(): void {
    console.log('row row')
    console.log(this.QuestionDetails)
    this.updatePermissions();
  }
  convertToPlain(html) {
    // Create a new div element
    var tempDivElement = document.createElement('div');

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || '';
  }
  updatePermissions() {
    if (this.QuestionDetails.is_published === true) {
      console.log(this.QuestionDetails.is_published);
      if (
        this.QuestionDetails.status === null ||
        this.QuestionDetails.status === 'pending'
      ) {
        this.Mode = 'Awaiting Approval';
      } else{
        this.Mode = 'Public';
      }
    } else {

      this.Mode = 'Private';
    }
    console.log('role role')
    console.log(this.UserType)
    switch (this.UserType) {

      case 'super':
        this.PublishUnPublishVisibility = true;
        this.EditButtonVisibility = true;
        this.approveButtonVisibility = true;
        this.DeleteVisibility = true;
        this.SelectionVisibility = true;
        // switch (this.Mode) {
        //   case 'Private':
        //     this.PublishUnPublishVisibility = false;
        //     this.EditButtonVisibility = true;
        //     this.DeleteVisibility = true;
        //     this.SelectionVisibility = true;
        //     break;
        //   case 'Awaiting Approval':
        //     this.PublishUnPublishVisibility = false;
        //     this.EditButtonVisibility = true;
        //     this.DeleteVisibility = true;
        //     this.SelectionVisibility = true;
        //     break;
        //   case 'Public':
        //     this.PublishUnPublishVisibility = false;
        //     this.EditButtonVisibility = true;
        //     this.DeleteVisibility = true;
        //     this.SelectionVisibility = false;
        //     break;
        // }
        break;
      case 'admin':
        this.approveButtonVisibility = false
        this.PublishUnPublishVisibility = true;
        this.EditButtonVisibility = true;
        this.DeleteVisibility = true;
        if(this.QuestionDetails.status != 'pending'){
          this.EditButtonVisibility = false;
        }
        break;
      case 'teacher':
        this.PublishUnPublishVisibility = true;
        this.EditButtonVisibility = true;
        this.DeleteVisibility = true;
        this.SelectionVisibility = true;
        switch (this.Mode) {
          case 'Private':
            this.PublishUnPublishVisibility = true;
            this.EditButtonVisibility = true;
            this.DeleteVisibility = true;
            this.SelectionVisibility = true;
            break;
          case 'Awaiting Approval':
            this.PublishUnPublishVisibility = true;
            this.EditButtonVisibility = false;
            this.DeleteVisibility = false;
            this.SelectionVisibility = false;
            break;
          case 'Public':
            this.PublishUnPublishVisibility = false;
            this.EditButtonVisibility = false;
            this.DeleteVisibility = false;
            this.SelectionVisibility = false;
            break;
        }

        if(this.QuestionDetails.status != 'pending'){
          this.EditButtonVisibility = false;
        }
        break;
    }
  }
 
  openNormalSchoolSettings(q: any) {
    console.log('you are now opening as normal settings');

    this.QuestionManager.getQuestionByIDDittofi(this.QuestionDetails.id).then((res: any) => {
     console.log('edit question')
     console.log(res)
      q.answers = res.data.answers
     
      const question = {
        edit : true, 
        question : res.data,

      }
      this.createQuestionService.selectedQuestion = question
      
      console.log(this.createQuestionService.SelectedClass);
      this.router.navigate(['createQuestion'], {
        relativeTo: this.activatedRoute,
      });
    }).catch((res) => {
      console.log(res)
      this.DialogSerivce.openDialog({
        title: 'There was an error retreiving the question',
        message: 'test',
        confirmText: 'Ok',
        cancelText: 'No',
        oneButton: true,
        DidConfirm: () => {},
      });
    })

  }
  openSuperAdminSettings(question) {
    this.QuestionManager.getQuestionByIDDittofi(question.id).then((res: any) => {

      console.log('get question by id')
      console.log(res.data)
      let transferredObj = {
        question: res.data,
        allGrades: this.allGrades,
        subject: this.subject,
      };
      this.dialog
        .open(QuestionSettingsDialogSaComponent, {
          autoFocus: false,
          data: {
            data: transferredObj,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          console.log('hello there')
          this.setMetadata.emit()
        });
      console.log('you are now opening as superadmin');

     }).catch((res) => {
       console.log(res)
       this.DialogSerivce.openDialog({
         title: 'There was an error retreiving the question',
         message: 'test',
         confirmText: 'Ok',
         cancelText: 'No',
         oneButton: true,
         DidConfirm: () => {},
       });
     })
  }
  triggerVisibility() {

    if(this.authManager.getTypeOfUser() == 'super'){
      switch (this.Mode) {
        case 'Private':
          this.QuestionManager.publishUnPublishQuestionDittofi(
            this.QuestionDetails.id,
            true
          )
            .then((res) => {
              // If a user wants to make his question public
              this.Mode = 'Awaiting Approval';
              this.QuestionDetails.is_published = true;
              // this.QuestionDetails.status = 'pending';
              // this.dialogManager.openDialog({
              //   title: 'Request Has Been Sent... Awaiting Approval',
              //   message: 'Success.. Awaiting Approval',
              //   confirmText: 'OK',
              //   cancelText: 'Cancel',
              //   oneButton: true,
              //   DidConfirm: () => {},
              // });
              this.updatePermissions();
            })
            .catch((err) => {
              this.dialogManager.openDialog({
                title:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                message:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            });
  
          break;
        case 'Awaiting Approval':
          // If a user wants to cancel his question from the public queue
          this.Mode = 'Private';
          this.QuestionManager.publishUnPublishQuestionDittofi(
            this.QuestionDetails.id,
            false
          )
            .then((res) => {
              this.Mode = 'Private';
              this.QuestionDetails.is_published = false;
              this.dialogManager.openDialog({
                title: 'Request Successfull',
                message: 'Request Successfull',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            })
            .catch((err) => {
              this.dialogManager.openDialog({
                title:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                message:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            });
  
          break;
        case 'Public':
          // If a user decides he wants to make his question private
          this.QuestionManager.publishUnPublishQuestionDittofi(
            this.QuestionDetails.id,
            false
          )
            .then((res) => {
              this.Mode = 'Private';
              this.QuestionDetails.is_published = false;
              // this.QuestionDetails.status = null;
              // this.dialogManager.openDialog({
              //   title: 'Request Successfull',
              //   message: 'Request Successfull',
              //   confirmText: 'OK',
              //   cancelText: 'Cancel',
              //   oneButton: true,
              //   DidConfirm: () => {},
              // });
              this.updatePermissions();
            })
            .catch((err) => {
              this.dialogManager.openDialog({
                title:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                message:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            });
  
          break;
      }
    }

    else{
      switch (this.Mode) {
        case 'Private':
          this.QuestionManager.awaitApprovalDittofi(
            this.QuestionDetails.id, 'Awaiting Approval'
          )
            .then((res) => {
              // If a user wants to make his question public
              this.Mode = 'Awaiting Approval';
              // this.QuestionDetails.is_published = true;
              // this.QuestionDetails.status = 'pending';
              this.dialogManager.openDialog({
                title: 'Request Has Been Sent... Awaiting Approval',
                message: 'Success.. Awaiting Approval',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            })
            .catch((err) => {
              this.dialogManager.openDialog({
                title:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                message:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            });
  
          break;
        case 'Awaiting Approval':
          // If a user wants to cancel his question from the public queue
          this.QuestionManager.awaitApprovalDittofi(
            this.QuestionDetails.id, 'pending'
          )
            .then((res) => {
              this.Mode = 'Private'
              this.QuestionDetails.is_published = false;

              this.dialogManager.openDialog({
                title: 'Request is canceled.',
                message: 'Request is canceled.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
            }).catch((err) => {
              this.dialogManager.openDialog({
                title:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                message:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            });
          
  
          break;
        case 'Public':
          // If a user decides he wants to make his question private
          this.QuestionManager.awaitApprovalDittofi(
            this.QuestionDetails.id,
            'pending'
          )
            .then((res) => {
              this.Mode = 'Private';
              this.QuestionDetails.is_published = false;
              this.QuestionDetails.status = null;
              this.dialogManager.openDialog({
                title: 'Request Successfull',
                message: 'Request Successfull',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            })
            .catch((err) => {
              this.dialogManager.openDialog({
                title:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                message:
                  'There was an Error Publishing/unPublishing your question. Please try again later.',
                confirmText: 'OK',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });
              this.updatePermissions();
            });
  
          break;
      }
    }

  }

  didClickPublic() {
    //API call to make public
  }
  didClickPrivate() {
    //API call to make private
  }
  didClickEdit() {
    this.isBeingEdited = true;
  }
  didClickExpand() {
    this.dialog.open(ViewQuestionDialogComponent, {
      autoFocus: false,
      data: {
        question: this.QuestionDetails,
      },
    });
  }
  didClickSelect() {
    this.DidSelectListener.emit(this.QuestionDetails);
  }
  didClickDelete() {
    this.DialogSerivce.openDialog({
      title: 'Are you sure you want to delete this Question?',
      message: 'test',
      confirmText: 'Yes',
      cancelText: 'No',
      oneButton: false,
      DidConfirm: () => {
        this.QuestionManager.deleteQuestionDittofi(this.QuestionDetails.id)
          .then((res) => {
            console.log(res)
            //success..
            this.DidDeleteListener.emit(this.QuestionDetails);
            this.DialogSerivce.openDialog({
              title: 'Question Deleted Successfully.',
              message: 'test',
              confirmText: 'Ok',
              cancelText: 'No',
              oneButton: true,
              DidConfirm: () => {},
            });
          })
          .catch((err) => {
            console.log(err)
            this.DialogSerivce.openDialog({
              title: 'There was an error deleting your question',
              message: 'test',
              confirmText: 'Ok',
              cancelText: 'No',
              oneButton: true,
              DidConfirm: () => {},
            });
          });
      },
    });
  }
  didClickSave() {}
  didClickCancel() {
    this.isBeingEdited = false;
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
