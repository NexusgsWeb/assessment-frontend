import { Component, OnInit } from '@angular/core';
import { StudentManagerService } from 'src/app/modules/_services/student-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-student-results',
  templateUrl: './view-student-results.component.html',
  styleUrls: ['./view-student-results.component.css']
})
export class ViewStudentResultsComponent implements OnInit {
  selectedSubject: any;
  subjects: any[] = [];
  assessments: any[] = [];
  SubjectNames: any[] = []
  constructor(private studentManager: StudentManagerService, private authManager: AuthManagerService,
              private assessmentManager: AssessmentManagerService, private subjectManager: SubjectsManagerService,
              private router: Router,     private route: ActivatedRoute
              ) { }

  ngOnInit(): void {
    this.getStudentSubjects(this.authManager.getSectionId())
  }
  getStudentSubjects(sectionId){
    this.subjectManager.getStudentSubjectsDittofi(sectionId).then((res: any) =>{
      console.log(res)
      console.log(sectionId)
      let temp = []
      for(let sub of res.data){
        let found = temp.find((item) => item.id == sub.id);
        if(found == undefined){
          sub.name = sub.grade_code + '-' + sub.subject_code
          temp.push(sub)
        }
      }
      this.subjects = temp
    }).catch((res) => {
      console.log(res)
    })

  }
  didSelectSubject(event){

    console.log(event)
    console.log(this.authManager.getUserId())
    this.assessmentManager.getResultsPerStudentDittofi(this.authManager.getUserId(), event.id).then((res : any) => {
      console.log(res)
      let temp = []
      for(let asst of res.data){
        let found = temp.find((item) => item.id == asst.id);
        if(found == undefined){
          asst.startsAtDateTime = asst.from_date
          asst.endsAtDateTime = asst.to_date
          asst.subjectTitle = event.subject_code
          asst.totalMark = asst.total_mark
          if(asst.mark >= (asst.total_mark/2)){
            asst.result = 'Passed'
          }
          else{
            asst.result = 'Failed'
          }

          temp.push(asst)
        }
      }

      temp = temp.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      console.log(temp)

      this.assessments = temp

      // for(let i =0; i< this.assessments.length; i++){
      //   this.getSubjectName(i, this.assessments[i].subjectID)

      // }

      for(let asst of this.assessments){
        const dateStartDate = new Date(asst.startsAtDateTime)
        const dateEndDate = new Date(asst.endsAtDateTime)

        const from = new DatePipe('en-Us').transform(dateStartDate, 'dd MMM yyyy hh:mm a');
        const to = new DatePipe('en-Us').transform(dateEndDate, 'dd MMM yyyy hh:mm a');


        asst.startsAtDateTime = from;
        asst.endsAtDateTime = to;
      }


    }).then((res) => {
      console.log(res)
    })
  }

  getSubjectName(index, subjectId){
    this.subjectManager.getSubjectName(this.authManager.getSchoolId(), subjectId).then((res:any) => {
      console.log(res)
      this.assessments[index].subjectName = ""
    }).catch((res) => {
      console.log(res)
    })
  }

  getSubjectNames(asstList: any[]) {
    var IDSToBeSubmitted = [];
    const state = asstList;
    state.forEach((element) => {
      IDSToBeSubmitted.push(element.subjectID + '');
    });
    this.subjectManager
      .getSubjectsNameBulkDittofi(IDSToBeSubmitted)
      .then((res: any) => {
        this.SubjectNames = res;
        console.log(res);
        this.FindSubject(asstList);
      })
      .catch((err) => {
        console.log('there was an error gettings your subjects');
      });
  }

  FindSubject(asstList :any[]) {
    for (var j = 0; j < asstList.length; j++) {
      const sub = this.SubjectNames.find((item) => {
        console.log(asstList[j].subjectID)
        console.log(item.id)
console.log('------------------------------------')
        return item.id == asstList[j].subjectID
      });
      if(sub != undefined){
        asstList[j].subjectTitle = sub.name;
      }

  }
  this.assessments = asstList
  // this.AssessmentList.next(asstList);
  // console.log(this.AssessmentList.getValue())
}

  viewStudentAnwers(assessment){
    this.router.navigate(['../viewStudentAnswers', assessment.id], {
      relativeTo: this.route,
    });

    // console.log(assessment.id)
    // console.log(this.authManager.getStudentId())
    // this.assessmentManager.getStudentResults('f0320f22-bde4-4d18-97e8-a7abe8e34f22', '2c8dbcec-c27d-48a9-b486-e796b2794207').then((res) => {
    //   console.log(res)
    // }).catch((res) => {
    //   console.log(res)
    // })
  }
}
