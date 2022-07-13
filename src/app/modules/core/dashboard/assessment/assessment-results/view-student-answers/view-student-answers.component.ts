import { Component, OnInit } from '@angular/core';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { WizenoseManagerService } from 'src/app/modules/_services/wizenose-manager.service';

@Component({
  selector: 'app-view-student-answers',
  templateUrl: './view-student-answers.component.html',
  styleUrls: ['./view-student-answers.component.css']
})
export class ViewStudentAnswersComponent implements OnInit {

  questions: any[] = [];
  loContent: any[] = [];
  assessment: any;
  constructor(private assessmentManager: AssessmentManagerService, private route: ActivatedRoute,
              private authManager: AuthManagerService, private wizeNoseManager: WizenoseManagerService,
              private router: Router) { }

  ngOnInit(): void {
    this.viewStudentAnswers();
    this.viewAssessmentDetails()
  }

  viewStudentAnswers(){
    const assessmentId = this.route.snapshot.params.id;

     console.log(assessmentId)
    this.assessmentManager.viewStudentResultDittofi(assessmentId, this.authManager.getUserId()).then((res : any) => {
      console.log(res)

      let temp = []
      for(let ques of res.data){
        let found = temp.find((item) => item.id == ques.id);
        if(found == undefined){
          temp.push(ques)
        }
      }
      this.questions = temp

    }).catch((res) => {
      console.log(res)
    })
  }

  checkStudentGrade(grade, totalGrade){
    const half = totalGrade/2;
    if(grade < half){
      return false
    }
    else{
      return true
    }
  }

  viewContent(question){

    let ls = question.learning_standards;
    let temp = []
    for(let l of ls){
      let found = temp.find((item) => item == l.wizenoze_query_id)
      if(found == undefined){
        temp.push(l.wizenoze_query_id)
      }
    }
    console.log(temp)
    let count = 0;
    for(let query_id of temp){
      this.wizeNoseManager.getLOPerformanceDittofi(query_id, 5, this.authManager.getTypeOfUser(), this.authManager.getUserId()).then((res : any) => {
        console.log(res)
        this.loContent = [...res.data.results];
        console.log(this.loContent)
        count ++;
        if(count == temp.length){
          this.wizeNoseManager.content.next(this.loContent);
          this.router.navigateByUrl('/assessment/content')
        }

      }).catch((res) => {
        console.log(res)

      })
    }


    }


    viewAssessmentDetails(){
      console.log(event)
      console.log(this.authManager.getUserId())
      const assessmentId = this.route.snapshot.params.id
      this.assessmentManager.getAssessmentResDittofi(assessmentId).then((res : any) => {
        console.log(res)

            res.data.startsAtDateTime = res.data.from_date
            res.data.endsAtDateTime = res.data.to_date
            // asst.subjectTitle = event.subject_code
            res.data.totalMark = res.data.total_mark
            if(res.data.mark >= (res.data.total_mark/2)){
              res.data.result = 'Passed'
            }
            else{
              res.data.result = 'Failed'
            }
        this.assessment = res.data




      }).then((res) => {
        console.log(res)
      })
    }

}
