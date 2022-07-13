import { Component, OnInit } from '@angular/core';
import { StudentManagerService } from 'src/app/modules/_services/student-manager.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { WizenoseManagerService } from 'src/app/modules/_services/wizenose-manager.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';

@Component({
  selector: 'app-improvemyperformance-student',
  templateUrl: './improvemyperformance-student.component.html',
  styleUrls: ['./improvemyperformance-student.component.css'],
})
export class ImprovemyperformanceStudentComponent implements OnInit {
  SelectedSubject;

  LOs = [0, 0, 0, 0];
  subjects: any[] = [];
  selectedSubject: any;
  learningObjectives: any[] = [];
  loContent: any[] = [];

  constructor(private studentManager: StudentManagerService,
              private authManager: AuthManagerService,
              private wizeNoseManager: WizenoseManagerService,
              private questionManager: QuestionmanagerService) {}

  ngOnInit(): void {
    console.log(this.authManager.getStudentId())
    this.getStudentSubjects(this.authManager.getStudentId());
  }

  getStudentSubjects(studentId){
    this.studentManager.getStudentSubjects(studentId).then((res: any) =>{
      console.log(res)
      this.subjects = res.student[0].section.subjects
    }).catch((res) => {
      console.log(res)
    })

  }

  didSelectSubject(event){
console.log(event)
// this.getLOContent([])

    this.questionManager.getLObyDomainDittofi("", "GR9", event.code).then((res: any) =>{
      console.log(res)
      this.learningObjectives = res.learningObjective

      for(let i =0 ; i < this.learningObjectives.length; i++){
        const rand = Math.floor((Math.random() * 100) + 1);
        console.log(rand)
        this.learningObjectives[i].value = rand
      }

      // this.getLOContent(loIds)
    }).catch((res) => {
      console.log(res)
    });
  }

  // removeAll(event){
  //   if(event.length == 0){
  //     this.selectedClasses = [];
  //     this.subjects = [];
  //     this.selectedSubjects = [];
  //     // this.assessments = [];
  //   }
  // }


}
