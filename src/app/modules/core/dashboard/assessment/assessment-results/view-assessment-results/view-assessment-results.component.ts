import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { id } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-view-assessment-results',
  templateUrl: './view-assessment-results.component.html',
  styleUrls: ['./view-assessment-results.component.css']
})
export class ViewAssessmentResultsComponent implements OnInit {

  @Output() onCheckCompleted = new EventEmitter<boolean>();
  @Output() onDisplayAnswers = new EventEmitter<boolean>();
  isPublished: boolean = true;
  assessmentResults: any[] = [];
  assessment: any;

  constructor(private router: Router, private assessmentManager: AssessmentManagerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('entered here')
    this.assessment = this.assessmentManager.assessmentData$.getValue()
    let assessmentId = this.route.snapshot.params.id;
    console.log('assessmentId')
    console.log(assessmentId)
    this.getAssessmentResult(assessmentId);

    this.checkPublished();
  }


  displayResults(index){

    this.assessmentResults[index].selected = true
    this.assessmentManager.results$.next(this.assessmentResults);

    this.onDisplayAnswers.emit(true);
  }

  checkPublished(){
    let check = true;
    for(let result of this.assessmentResults){
      if(result.hasNonCorrectedAnswers ==  true){
        check = false;
      }
    }

    this.onCheckCompleted.emit(check);

  }
  studentNameSymbol(student: any){
    const comp = student.name.split(' ', 2);
    const nameSymbol = comp[0].charAt(0) + comp[1].charAt(0);

    return nameSymbol;
  }

  getAssessmentResult(assessmentId){
    this.assessmentManager.getAssessmentResultsDittofi(assessmentId).then((res : any) => {
      console.log(res);
      let temp = []
      for(let asst of res.data){
        let found = temp.find((item) => item.student_id == asst.student_id)
        if(found == undefined){
          temp.push(asst)
        }
      }
      this.assessmentResults = temp;
      console.log(this.assessmentResults)
      // this.assessmentResults = res.assessment[0].results;

      // for(let result of this.assessmentResults){
      //   result.selected = false;
      // }

    }).catch((res) => {
      console.log(res);
    })
  }

  studentResult(assessment){
    if(assessment.is_completed){
      let passed = assessment.total_mark/2
      if(assessment.mark >= passed){
        return 'Passed'
      }
      else{
        return 'Failed'
      }
    }
    else{
      return 'Incomplete'
    }
  }


}
