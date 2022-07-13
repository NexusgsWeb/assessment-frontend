import { Component, OnInit } from '@angular/core';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { SectionManagerService } from 'src/app/modules/_services/section-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { Router } from '@angular/router';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
@Component({
  selector: 'app-reset-assessment',
  templateUrl: './reset-assessment.component.html',
  styleUrls: ['./reset-assessment.component.css']
})
export class ResetAssessmentComponent implements OnInit {

  classes: any[] = [];
  sections: any[] = [];
  subjects: any[] = [];
  assessments: any[] = [];
  assessmentResults: any[] = [];

  selectedClass: any;
  selectedSection: any;
  selectedSubject: any;
  selectedAssessment: any;

  students: any[] = [];
  constructor(private subjectsManagerService: SubjectsManagerService,
              private schoolService: SchoolManagerService,
              private sectionService: SectionManagerService,
              private DialogService: DialogServiceService,
              private assessmentManager: AssessmentManagerService,
              private router: Router,
              private authService: AuthManagerService) { }

  async ngOnInit() {
    if(this.authService.getTypeOfUser() == 'admin'){
      await this.getAdminClasses();
    }
    else{
      await this.getClasses()
    }
  }

  getAdminClasses(){
    // console.log(this.authService.getSchoolId())
    this.subjectsManagerService
    .getAdminClassesDittofi(1)
    .then((data: any) => {
      console.log(data)
      let cls = data.data;
      this.classes = cls
    })
    .catch((err) => {
      this.DialogService.openDialog({
        title:
          err.error.message,
        message: 'test',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    });


  }
  onClassSelected(event){
    console.log(event)
    this.getClassSubjects(event.id);

  };
  onSectionSelected(event){
    console.log(event)
  }
  onSubjectSelected(event){
    this.getSubjectAssessments(event);
  }
  onAssessmentSelected(event){
    this.getStudentsSection(this.selectedSection.Id)
    // this.correctAssessment(event.id)
  }

  getStudentsSection(id){
    this.assessmentManager.getSectionStudentsDittofi(id).then((data : any) => {
      console.log(data.data.data)
      this.assessmentResults = data.data.data
    })
    .catch((data) => {
      console.log(data)
    })
  }

  getClasses(){

    this.subjectsManagerService
    .getAllClassesDittofi(this.authService.getUserId())
    .then((data: any) => {
      console.log(data)
      let cls = data.data;
      this.classes = cls
    })
    .catch((err) => {
      this.DialogService.openDialog({
        title:
          err.error.message,
        message: 'test',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    });


  }

  getClassSubjects(classId) {
    console.log(classId)
    this.subjectsManagerService
      .getClassSubjectsAssessment(
        classId
      )
      .then((res: any) => {
        console.log(res);
        const tempSubjects = res.data;
        for (let i = 0; i < tempSubjects.length; i++) {
          tempSubjects[i].classId = classId;
          tempSubjects[i].sectionName = tempSubjects[i].section_id;
        }
        this.subjects = tempSubjects;
        this.subjects = this.subjects.sort((item1, item2) =>
          item1.subject_order > item2.subject_order ? 1 : -1
        );
        console.log(this.subjects);
      })
      .catch((res) => {

        console.log("hello subjects");
        console.log(res);


        let finalErr = 'Internal Server Error'
        if(res.error != undefined){
          finalErr = res.error.message;
        }
        console.log(res);

        console.log(res.error.message);
        this.DialogService.openDialog({
          title: finalErr,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {

          }
        });

      });
    this.getClassSection(classId);
  }

  getClassSection(id: string) {
    console.log('entered entered sections');
    console.log(id)
    console.log(this.schoolService.getCurrentSchoolID())
    this.sectionService
      .getSectionsOfCAYDittofi(this.schoolService.getCurrentSchoolID(), id)
      .then((res: any) => {
        console.log(res);
        this.sections = res.data;
        // this.StudentInfoFormGroup.get('sectionId').setValue(SectionCreated);
        // this.SectionSelector.bindLabel
        // console.log(SectionCreated);
      })
      .catch((res) => {
        console.log("hello classes");
        console.log(res);

        let finalErr = 'Internal Server Error'
        if(res.error != undefined){
          finalErr = res.error.message;
        }
        console.log(res);

        console.log(res.error.message);
        this.DialogService.openDialog({
          title: finalErr,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {

          }
        });
      });
  }

  getSubjectAssessments(subject){
    console.log(subject)
    if(this.selectedSection == undefined){
      this.DialogService.openDialog({
        title: "Select a section please",
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {

        }
      });
    }
    else{
      console.log(this.selectedSection)
      this.assessmentManager.getAssessmentsPerSectionDittofi(subject.id, this.selectedSection.Id).then((res: any) => {

        console.log(res)
        const tempAsst = res.data;
        console.log(tempAsst)
        this.assessments = res.data
        this.assessments = this.assessments.sort((item1, item2) =>
        new Date(item1.from_date) < new Date(item2.from_date) ? 1 : -1
      );

        console.log(res)

      })
      .catch((res) =>{
        console.log(res)
            this.DialogService.openDialog({
              title: res.error.message,
              message: 'test',
              confirmText: 'Okay',
              cancelText: 'Cancel',
              oneButton: true,
              DidConfirm: () => {

              }
            });

      })
    }

  }

  correctAssessment(assessmentId){
    this.assessmentManager.correctAssessmentDittofi(assessmentId, this.authService.getUserId()).then((res : any) => {
      this.getAssessmentResults(assessmentId);
    }).catch((res) =>{
      console.log(res)
    })
  }
  getAssessmentResults(assessmentId){
    this.assessmentManager.getAssessmentResults(assessmentId).then((res: any) =>{
      console.log(res)
      this.assessmentResults = res.assessment[0].results;
    }).catch((res) => {
      console.log(res)
    })
  }

  resetAssessment(user_id){
    this.assessmentManager.resetAssessmentDittofi(this.selectedAssessment.id, user_id).then((res : any) =>{
      console.log(res);
      this.DialogService.openDialog({
        title:
          'Assessment reseted!!',
        message:
          'Assessment reseted!!',
        confirmText: 'OK',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });

    })
    .catch((res) => {
      console.log(res);
    });
  }

  resetAll(){
    for(let result of this.assessmentResults){
      this.resetAssessment(result);
    }
  }

  viewStudentAnswers(assessment){
    this.assessmentManager.getStudentAnswersDittofi(assessment.assessmentId, assessment.studentId).then((res: any) => {
      console.log(res);


    }).catch((res) =>{
      console.log(res);
    })
  }

}
