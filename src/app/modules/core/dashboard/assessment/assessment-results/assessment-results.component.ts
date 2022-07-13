import { Component, OnInit } from '@angular/core';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.css']
})
export class AssessmentResultsComponent implements OnInit {

  isPublished: boolean = true;
  clicked: boolean = false;
  assessment: any;

  constructor(private assessmentManager: AssessmentManagerService, private route: ActivatedRoute,
    private DialogService: DialogServiceService, private router: Router) { }

  ngOnInit(): void {

    // this.assessment = this.assessmentManager.assessmentData$.getValue();
    console.log("hello there")
    let assessmentId = this.route.snapshot.params.id;

    this.getAssessmentById(assessmentId);
  }

  checkPublish(event){
    this.isPublished = event;
  }

  displayResults(event){
    this.clicked = event;

  }

  getAssessmentById(assessmentId){
    console.log(assessmentId);
    this.assessmentManager.getSpecificAssessmentDittofi(assessmentId).then((res: any) => {
      console.log(res);
      const dateStartDate = new Date(res.data.from_date)
      const dateEndDate = new Date(res.data.to_date)

      const from = new DatePipe('en-Us').transform(dateStartDate, 'dd MMM yyyy hh:mm a');
      const to = new DatePipe('en-Us').transform(dateEndDate, 'dd MMM yyyy hh:mm a');


      res.data.from_date = from;
      res.data.to_date = to;
      if(res.data.is_published == null){
        res.data.is_published = false
      }
      this.assessment = res.data;

      this.assessmentManager.assessmentData$.next(this.assessment)

    }).catch((res) => {
      console.log(res);
      this.DialogService.openDialog({
        title: 'No results to display',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
          this.router.navigate(['../assessment/viewAssessments'])
        }
      });
    });

  }

  publishResults(){
    let publish = true;
    if(this.assessment.is_published == true){
      publish = false;
    }
    this.assessmentManager.publishResultsDittofi(this.assessment.id, publish).then((item) => {
      this.assessment.is_published = publish
    })
    .catch((item) => {

    })
  }

}
