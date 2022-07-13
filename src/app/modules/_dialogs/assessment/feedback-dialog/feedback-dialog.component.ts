import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent implements OnInit {

  feedback = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    private questionService: QuestionmanagerService
  ) { }

  ngOnInit(): void {

    console.log(this.data)
  }

  sendFeedback(){



    this.questionService.addFeedbackDittofi(this.data.studentId, this.data.assessmentId,
      this.data.answerId, this.feedback).then((res) =>{
      console.log(res);
    }).catch((res)=>{
      console.log(res);
    })


    this.closeDialog();

    //call submit feedback API
  }
  closeDialog(){
    console.log('entered')
    this.dialogRef.close();
  }
}
