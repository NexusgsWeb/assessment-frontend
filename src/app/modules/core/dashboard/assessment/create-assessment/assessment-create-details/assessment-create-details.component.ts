import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AcademicClass } from 'src/app/modules/Models/AcademicClass';
import { Section } from 'src/app/modules/Models/Section';
import { Assessment } from 'src/app/modules/Models/Assessment';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { SectionManagerService } from 'src/app/modules/_services/section-manager.service';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { Subject } from 'src/app/modules/Models/Subject';
import { Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-assessment-create-details',
  templateUrl: './assessment-create-details.component.html',
  styleUrls: ['./assessment-create-details.component.css'],
})
export class AssessmentCreateDetailsComponent implements OnInit {
  @Output() onAssessmentCreate = new EventEmitter<number>();
  @Output() createdAssessment = new EventEmitter<Assessment>();

  //classes
  classes: AcademicClass[] = [];
  selectedClass: AcademicClass;
  tempselectedClasses: AcademicClass[] = [];

  //subject classes
  subjects: any[] = [];
  selectedSubject: Subject;
  tempSub: any[] = [];

  //sections
  sections: Section[] = [];
  selectedSections: Section[] = [];

  assessmentCredentials: Assessment = new Assessment();

  public date: UntypedFormControl;
  editedAssessment: any;
  assessments: any[] = [];

  constructor(
    private subjectsManagerService: SubjectsManagerService,
    private schoolService: SchoolManagerService,
    private sectionService: SectionManagerService,
    private assessmentManagerService: AssessmentManagerService,
    private DialogSerivce: DialogServiceService,
    private datepipe: DatePipe,
    private router: Router,
    private academicYearService: AcademicClassService,
    private authManager: AuthManagerService
  ) {}

  ngOnInit(): void {
    this.date = new UntypedFormControl(new Date());
    const serializedDate = new UntypedFormControl(new Date().toISOString());
    if(this.authManager.getTypeOfUser() == 'admin'){
      this.getAdminClasses()
    }
    else{
      this.getClasses();
    }
    const asst = this.assessmentManagerService.newAssessment$.getValue();
    const sections = this.assessmentManagerService.selectedSections$.getValue();
    if (asst != null) {
      this.assessmentCredentials = asst;
      this.getClassSubjects(this.assessmentCredentials.class);

      this.selectedSections = sections;
    } else {
      this.assessmentCredentials.instruction =
        'If students’ session / examinations terminates due to any technical reason, he will be allowed to login again on resumption of his internet / electricity only if it happens with in examinations allotted time and his examination will resume from where it was terminated.';
    }

    this.editedAssessment =
      this.assessmentManagerService.editedAssessment$.getValue();
    if (this.editedAssessment != null) {
      console.log(this.editedAssessment);
      this.editedAssessment.startsAtDateTime = this.editedAssessment.from_date
      this.editedAssessment.endsAtDateTime = this.editedAssessment.to_date
      this.editedAssessment.testDurationInMinuets = this.editedAssessment.duration
      this.editedAssessment.instruction = this.editedAssessment.instructions
      this.assessmentCredentials.class = this.editedAssessment.class.id;
      this.assessmentCredentials.endDate = this.editedAssessment.endsAtDateTime;
      const end = new Date(this.editedAssessment.endsAtDateTime);
      this.assessmentCredentials.endTime = this.datepipe.transform(
        end,
        'HH:mm'
      );
      this.assessmentCredentials.endsAtDateTime = this.datepipe.transform(
        end,
        'yyyy-MM-dd'
      );

      this.assessmentCredentials.id = this.editedAssessment.id;
      this.assessmentCredentials.instruction =
        this.editedAssessment.instruction;
      this.assessmentCredentials.selectedClass = this.editedAssessment.class;
      this.assessmentCredentials.startDate =
        this.editedAssessment.startsAtDateTime;
      const start = new Date(this.editedAssessment.startsAtDateTime);
      this.assessmentCredentials.startTime = this.datepipe.transform(
        start,
        'HH:mm'
      );
      this.assessmentCredentials.startsAtDateTime = this.datepipe.transform(
        start,
        'yyyy-MM-dd'
      );
      this.assessmentCredentials.subject = this.editedAssessment.subject;
      this.editedAssessment.subjectID = this.editedAssessment.subject_id;
      this.assessmentCredentials.subjectID = this.editedAssessment.subjectID;
      this.assessmentCredentials.testDurationInMinuets =
        this.editedAssessment.testDurationInMinuets;
      this.assessmentCredentials.title = this.editedAssessment.title;
      this.assessmentCredentials.edit = this.editedAssessment.edit;

      console.log('selected class')
      console.log(this.assessmentCredentials.class)
      this.getClassSubjects(this.assessmentCredentials.class);
      let sec = [];
      for(let section of this.editedAssessment.sections){
        sec.push(section.section_id)
      }
      this.selectedSections = this.editedAssessment.sections;

      console.log(this.assessmentCredentials);
    }
  }

  getAdminClasses(){
    // console.log(this.authService.getSchoolId())
    this.subjectsManagerService
    .getAdminClassesDittofi(1)
    .then((data: any) => {
      console.log(data)
      this.classes = data.data;
    })
    .catch((err) => {
      this.DialogSerivce.openDialog({
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

  getClasses() {
    this.subjectsManagerService
    .getAllClassesDittofi(this.authManager.getUserId())
      .then((res: any) => {
        this.classes = res.data;
        console.log(this.classes);
      })
      .catch((res) => {
        console.log("hello classes")
        console.log(res);

        let finalErr = 'Internal Server Error'
        if(res.error != undefined){
          finalErr = res.error.message;
        }
        console.log(res);

        console.log(res.error.message);
        this.DialogSerivce.openDialog({
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
        this.tempSub = this.subjects;
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
        this.DialogSerivce.openDialog({
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
  editAssessment() {
    const start =
      this.assessmentCredentials.startsAtDateTime +
      'T' +
      this.assessmentCredentials.startTime;
    const end =
      this.assessmentCredentials.endsAtDateTime +
      'T' +
      this.assessmentCredentials.endTime;
    console.log('entered');
    const dateNow = new Date();
    const dateStart = new Date(start);
    const dateEnd = new Date(end);

    // this.router.navigateByUrl('/assessment/viewAssessments');

    if (dateEnd < dateStart) {
      this.DialogSerivce.openDialog({
        title: 'end date cannot be greater then start date',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    } else if (dateStart < dateNow || dateEnd < dateNow) {
      this.DialogSerivce.openDialog({
        title: 'Assessment date cannot be in the past',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    } else {
      const s = this.assessmentCredentials.startsAtDateTime +
      'T' +
      this.assessmentCredentials.startTime;

      this.assessmentCredentials.startDate = new Date(s).toISOString();

      const e =  this.assessmentCredentials.endsAtDateTime +
      'T' +
      this.assessmentCredentials.endTime;
      this.assessmentCredentials.endDate = new Date(e).toISOString();

      console.log(this.assessmentCredentials.startDate)
      console.log(this.assessmentCredentials.endDate)


      this.assessmentManagerService
        .editAssessmentDittofi(this.assessmentCredentials, this.selectedSections)
        .then((res: any) => {
          console.log(res);

          this.DialogSerivce.openDialog({
            title: 'Assessment edited successfully',
            message: 'test',
            confirmText: 'Okay',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {
              this.router.navigate(['/assessment/viewAssessments']);
            },
          });
        })
        .catch((res) => {

          console.log(res)
        let finalErr = 'Internal Server Error'
        if(res.error != undefined){
          finalErr = res.error.message;
        }
        console.log(res);

        console.log(res.error.message);
        this.DialogSerivce.openDialog({
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
  }

  changeClass(event) {
    console.log(event);

    if (event === undefined) {
      this.subjects = [];
      this.assessmentCredentials.subjectID = null;
      this.selectedSubject = new Subject();
      this.sections = [];
      this.selectedSections = [];
    } else {
      console.log('entered entered sections0');
      console.log(event)
      this.subjects = [];
      this.selectedClass = new AcademicClass();
      this.assessmentCredentials.subjectID = null;
      this.selectedSubject = new Subject();
      this.sections = [];
      this.selectedSections = [];
      this.getClassSubjects(event.id);
    }
  }

  getClassSection(id: string) {
    console.log('entered entered sections');
    console.log(id)
    console.log(this.schoolService.getCurrentSchoolID())
    this.sectionService
      .getSectionsOfCAYDittofi(this.schoolService.getCurrentSchoolID(), id)
      .then((res: any) => {
        console.log('sectionss')
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
        this.DialogSerivce.openDialog({
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

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  createAssessment() {
    if (this.assessmentCredentials.testDurationInMinuets === '0') {
      this.DialogSerivce.openDialog({
        title: 'Assessment Duration cannot be zero.',
        message: 'Assessment Duration cannot be zero.',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
      return;
    }


    const start =
      this.assessmentCredentials.startsAtDateTime +
      'T' +
      this.assessmentCredentials.startTime;
    const end =
      this.assessmentCredentials.endsAtDateTime +
      'T' +
      this.assessmentCredentials.endTime;
    console.log('entered');
    const dateNow = new Date();
    const dateStart = new Date(start);
    const dateEnd = new Date(end);

    // this.router.navigateByUrl('/assessment/viewAssessments');

    const s = this.assessmentCredentials.startsAtDateTime +
    'T' +
    this.assessmentCredentials.startTime;

    this.assessmentCredentials.startDate = new Date(s).toISOString();

    const e =  this.assessmentCredentials.endsAtDateTime +
    'T' +
    this.assessmentCredentials.endTime;
    this.assessmentCredentials.endDate = new Date(e).toISOString();

    console.log(this.assessmentCredentials.startDate)
    console.log(this.assessmentCredentials.endDate)
    console.log("assessment title")
    console.log(this.assessmentCredentials.title.trim().length)



  let diffMs = (dateEnd.getTime() - dateStart.getTime());
  let diffMins = Math.floor((diffMs/1000)/60); // minutes

  console.log(dateStart)
  console.log(dateEnd)
  console.log(diffMins)
  console.log(this.assessmentCredentials.testDurationInMinuets)

  let check = false;
  if(this.assessments != undefined && this.assessments.length > 0){
    for(let asst of this.assessments){
      if(asst.title === this.assessmentCredentials.title){
        check = true
      }
    }
  }



    if(check == true){
      this.DialogSerivce.openDialog({
        title: 'Another assessment with the same title already exists',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    else if (dateEnd < dateStart) {
      this.DialogSerivce.openDialog({
        title: 'End date cannot be earlier than Start date',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    } else if (dateStart < dateNow || dateEnd < dateNow) {
      this.DialogSerivce.openDialog({
        title: 'Assessment date cannot be in the past',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    else if(diffMins < Number(this.assessmentCredentials.testDurationInMinuets)){
      this.DialogSerivce.openDialog({
        title: 'Planned test time cannot be greater than the difference between start date and end date',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    else {
      this.assessmentCredentials.subject = this.subjects.find(
        (item) => item.id == this.assessmentCredentials.subjectID
      );


      this.assessmentCredentials.selectedClass = this.classes.find(
        (item) => item.id == this.assessmentCredentials.class
      );

      this.assessmentManagerService.newAssessment$.next(
        this.assessmentCredentials
      );
      this.assessmentManagerService.selectedSections$.next(
        this.selectedSections
      );
        this.assessmentCredentials.status = 'pending'
        this.assessmentCredentials.createdAt = new Date().toISOString();

        this.onAssessmentCreate.emit(2);
        this.createdAssessment.emit(this.assessmentCredentials);
    }
  }

  cancel() {
    this.router.navigate(['/assessment/viewAssessments']);
  }

  onSubjectSelected(event){
    console.log(event)
    this.assessmentManagerService.getSubjectAssessmentsDittofi(event.id).then((res: any) => {
      console.log(res)
      this.assessments = res.data;
    })
    .catch((res) =>{
      console.log(res)
          this.DialogSerivce.openDialog({
            title: res.error.message,
            message: 'test',
            confirmText: 'Okay',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {

            }
          });

    })

    //Implement when completing getAssessments() API

    // for(let assessment of this.tempAssessments){
    //   if(assessment.subject.toLocaleLowerCase() == e.name.toLocaleLowerCase()){
    //     this.assessments.push(assessment);
    //   }
    // }
    // get assessment API for specific class and subject
  }
}
