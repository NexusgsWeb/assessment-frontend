import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'src/app/modules/Models/Subject';
import { AcademicClass } from 'src/app/modules/Models/AcademicClass';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { SectionManagerService } from 'src/app/modules/_services/section-manager.service';
import { Section } from 'src/app/modules/Models/Section';
import { Assessment } from 'src/app/modules/Models/Assessment';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { AssessmentCreateDetailsComponent } from './assessment-create-details/assessment-create-details.component';
import { LearningObjectivesComponent } from './learning-objectives/learning-objectives.component';
import { AssessmentQuestionsComponent } from './assessment-questions/assessment-questions.component';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css'],

})
export class CreateAssessmentComponent implements OnInit {
  @ViewChild('template', { read: ViewContainerRef })
  template: ViewContainerRef;

  chosenLearningObjectives: any;
  createdAssessment: Assessment;
  
  //classes
  classes: AcademicClass[] = [];
  selectedClass: AcademicClass;
  tempselectedClasses: AcademicClass[] = [];

  //subject classes
  subjects: Subject[] = [];
  selectedSubject: Subject;
  tempSub: Subject[] = [];

  //sections
  sections: Section[] = [];
  selectedSections: Section[] = [];
  stepCount: number = 1;

  assessmentCredentials: Assessment = new Assessment();
   assessment: Assessment;
   learningStandard: any;
   questions: any

    edit = false;
   editedAssessment: any;

  

  public date: Date = new Date();
  
  constructor(private assessmentManagerService: AssessmentManagerService ) { }

  ngOnInit(): void {
    this.assessment = this.assessmentManagerService.newAssessment$.getValue();
    this.learningStandard = this.assessmentManagerService.learningStandards$.getValue();
    this.questions = this.assessmentManagerService.questions$.getValue();


    this.editedAssessment = this.assessmentManagerService.editedAssessment$.getValue();
      if(this.editedAssessment != null){
        this.edit = this.editedAssessment.edit;
      }

  }

 
  
  detectStep(number){
    this.assessment = this.assessmentManagerService.newAssessment$.getValue();
    this.learningStandard = this.assessmentManagerService.learningStandards$.getValue();

    console.log(number)
    this.stepCount = number;
    console.log(this.assessment)
    
    // let temp;
    // switch(number){
    //   case 1: 
    //   temp = this.componentFactoryResolver.resolveComponentFactory(AssessmentCreateDetailsComponent); 
    //   this.template.createComponent(temp);
    //   break;
    //   case 2:
    //     temp = this.componentFactoryResolver.resolveComponentFactory(LearningObjectivesComponent);
    //     this.template.createComponent(temp); 
    //   break;
    //   case 3: 
    //   temp = this.componentFactoryResolver.resolveComponentFactory(AssessmentQuestionsComponent); 
    //   break;
    //   case 4: 
    //   break;
    // }
    
  }
  transmitInfo(event){
    this.chosenLearningObjectives = event;
  }

  assessmentCreated(event){
    this.createdAssessment = event;
  }

  hello(event){
    console.log("hello")
    console.log(event)
  }

  
}
