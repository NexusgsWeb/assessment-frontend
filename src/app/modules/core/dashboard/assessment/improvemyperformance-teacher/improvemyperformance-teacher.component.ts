import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { WizenoseManagerService } from 'src/app/modules/_services/wizenose-manager.service';

@Component({
  selector: 'app-improvemyperformance-teacher',
  templateUrl: './improvemyperformance-teacher.component.html',
  styleUrls: ['./improvemyperformance-teacher.component.css'],
})
export class ImprovemyperformanceTeacherComponent implements OnInit {
  LOs = [0, 0, 0, 0];
  StudentsForLO = [{name: "john doe", value: 70, show: false}, {name: "Amanda Smith", value: 40, show: false},
  {name: "Sara Dao", value: 100, show: false}, {name: "Sally Amar", value: 20, show: false}];

  classes: any[] = [];
  subjects: any[] = [];
  learningObjectives: any[] = [];
  loContent: any[] = [];
  showContent: boolean = false;

  selectedClass: any;
  selectedSubject: any;

  constructor(private subjectsManagerService: SubjectsManagerService,
              private schoolService: SchoolManagerService,
              private questionManager: QuestionmanagerService,
              private wizeNoseManager: WizenoseManagerService) {}

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(){
    this.subjectsManagerService
      .getAllClassesDittofi(this.schoolService.getCurrentSchoolID())
      .then((res: any) => {
        console.log(res)
        this.classes = res.classes
      })
      .catch((res) => {
      });
  }

  getSelectedClassSubjects(u) {
      this.subjectsManagerService
        .getClassSubjectsDittofi(this.schoolService.getCurrentSchoolID(), u.id)
        .then((res: any) => {
          console.log(res)
          this.subjects = res.subject
        })
        .catch((res) => {

          console.log(res);
        });
      // this.getSectionsPerClass(selectedC.id);

  }
  getLOs(event){
  //   this.getLOContent([
  //     162,
  //     163,
  //     164
  // ])
    this.questionManager.getLObyDomainDittofi("", this.selectedClass.code, event.code).then((res: any) =>{
      console.log(res)
      this.learningObjectives = res.learningObjective

      for(let i =0 ; i < this.learningObjectives.length; i++){
        const rand = Math.floor((Math.random() * 100) + 1);
        console.log(rand)
        this.learningObjectives[i].value = rand
      }

      this.StudentsForLO = [{name: "john doe", value: 70, show: true}, {name: "Amanda Smith", value: 40, show: true},
      {name: "Sara Dao", value: 100, show: true}, {name: "Sally Amar", value: 20, show: true}];
      // const loIds = [];

      // for(let lo of this.learningObjectives){
      //   loIds.push(lo.id);
      // }
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

  getLOContent(los: any[]){

    this.wizeNoseManager.getLOPerformance(los).then((res : any) => {
      console.log(res.suggestions)
      this.loContent = res.suggestions;
      const names = ['Thales theorem', 'Similar triangles', 'Vector in a plane']
      for(let i =0 ; i < this.loContent.length; i++){
        this.loContent[i].loName = names[i]
      }
      this.StudentsForLO = [{name: "john doe", value: 70, show: true}, {name: "Amanda Smith", value: 40, show: true},
      {name: "Sara Dao", value: 100, show: true}, {name: "Sally Amar", value: 20, show: true}];
    }).catch((res) => {
      console.log(res)
    })
  }


}
