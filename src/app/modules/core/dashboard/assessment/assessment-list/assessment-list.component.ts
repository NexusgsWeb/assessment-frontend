import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AcademicClass } from 'src/app/modules/Models/AcademicClass';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { Subject } from 'src/app/modules/Models/Subject';
import { UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { Assessment } from 'src/app/modules/Models/Assessment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { formatDate, DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AcademicYearManagerService } from 'src/app/modules/_services/academic-year-manager.service';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'DD-MMM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AssessmentListComponent implements OnInit {
  @ViewChild('FilterFormField') FilterFormField: MatSelect;

  //classes
  classes: BehaviorSubject<AcademicClass[]> = new BehaviorSubject<AcademicClass[]>([]);
  selectedClasses: AcademicClass[] = [];
  tempselectedClasses: AcademicClass[] = [];

  filterControl = new UntypedFormControl(["All"]);
  selectedClass: String[] = ["All"];
  filterList: string[] = [];
  checkAll: boolean = false;



  //filter by date
  dateRange = this._formBuilder.group({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });


  //subject classes
  subjects: any[] = [];
  subjectsAll: any[] = [];
  selectedSubjects: any[] = [];
  tempSub: any[] = [];

  //assessments
  assessments: any[] = [];
  assessmentCredentials: any;
  tempAssessments: any[] = [];

  //pagination
  currentPage = 1;
  StartIndex: any = 1;
  EndIndex: any = 0;

  //delete selected
  deleteSelected: any[] =[];



  constructor(private schoolService: SchoolManagerService,
    private subjectsManagerService: SubjectsManagerService,
    private _formBuilder: UntypedFormBuilder,
    private DialogSerivce: DialogServiceService,
    private router: Router,
    private assessmentManagerService: AssessmentManagerService,
    private academicYearService: AcademicClassService,
    private authService: AuthManagerService

    ) { }

  async ngOnInit(): Promise<void> {


    const tempAsst = this.assessmentManagerService.viewAssessementsObject$.getValue();
    const finishedAsst = this.assessmentManagerService.finishedAsst$.getValue();

    console.log(this.authService.getTypeOfUser())
    this.assessmentManagerService.learningStandards$.next(null);
    this.assessmentManagerService.newAssessment$.next(null);
    this.assessmentManagerService.published$.next(null);
    this.assessmentManagerService.questions$.next(null);
    this.assessmentManagerService.selectedSections$.next(null);
    this.assessmentManagerService.results$.next(null);
    this.assessmentManagerService.time$.next(null);
    this.assessmentManagerService.editedAssessment$.next(null);
    if(finishedAsst == false){
      if(this.authService.getTypeOfUser() == 'admin'){
        await this.getAdminClasses();
      }
      else{
        await this.getClasses()
      }

    }
    else{

      console.log(this.classes)
      console.log(this.subjects)
      console.log(tempAsst)
      // if(tempAsst.classes.getValue() == null || tempAsst.classes.getValue() == undefined){
        if(this.authService.getTypeOfUser() == 'admin'){
          this.getAdminClasses();
        }
        else{
          this.getClasses()

        }
      // }
    //   else{
    //     this.classes.next(tempAsst.classes.getValue());
    //   this.subjects = tempAsst.subjects;
    //   this.selectedClasses = tempAsst.selectedClasses
    //   this.selectedSubjects = tempAsst.selectedSubjects
    //   this.assessments = tempAsst.assessments
    //   this.assessments = this.assessments.sort((item1, item2) =>
    //   new Date(item1.createdAt) < new Date(item2.createdAt) ? 1 : -1
    // );
    //   this.tempAssessments = this.assessments
    //   }

      // this.assessmentManagerService.viewAssessementsObject$.next(null);
      this.assessmentManagerService.finishedAsst$.next(false)
    }

     // Setup default date
    //  var DefaultDate = new Date();
     // Default is 7 days after today
    //  DefaultDate.setDate(DefaultDate.getDate() + 7);
    //  this.dateRange.setValue({ start: new Date(), end: DefaultDate });
    //  this.dateRange.updateValueAndValidity();

     this.showNumber();
     this.filterList = this.generateUniqueClasses();

  }

  getSelectedClassSubjects(u) {
    this.tempselectedClasses = this.selectedClasses;
    if (this.selectedClasses.length > 0) {
      this.subjectsManagerService
      .getClassSubjectsAssessment(
        u.id
      )
        .then((res: any) => {
          console.log(res)
          const tempSubjects = res.data;
          const tempDuplicates = [];
          for (let i = 0; i < tempSubjects.length; i++) {
            tempSubjects[i].classId = u.id;
            tempSubjects[i].sectionName = tempSubjects[i].section_code;

            const duplicate = this.subjects.find(item => item.name === tempSubjects[i].name);
            console.log(duplicate)
            if(duplicate == undefined){
              tempDuplicates.push(tempSubjects[i]);
            }
          }
          //all retreived subjects
          this.subjectsAll = this.subjectsAll.concat(tempSubjects);
          this.subjectsAll = this.subjectsAll.sort((item1, item2) =>
            item1.subject_order > item2.subject_order ? 1 : -1
          );

          this.subjects = this.subjects.concat(tempDuplicates);
          this.subjects = this.subjects.sort((item1, item2) =>
            item1.subject_order > item2.subject_order ? 1 : -1
          );

          this.tempSub = this.subjects;
          console.log(this.subjects)

          this.fillInfo();
        })
        .catch((res) => {
          console.log(res);


          this.DialogSerivce.openDialog({
            title: res.error.message,
            message: 'test',
            confirmText: 'Okay',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {

            }
          });


        });
      // this.getSectionsPerClass(selectedC.id);
    }
  }

  removeAll(event){
    if(event.length == 0){
      this.selectedClasses = [];
      this.subjects = [];
      this.selectedSubjects = [];
      this.assessments = [];
    }
  }

  removeAllSubjects(event){
    console.log(event)

    if(event.length == 0){
      this.selectedSubjects = [];
      this.assessments = [];
    }
  }
  getClasses(){

    this.subjectsManagerService
    .getAllClassesDittofi(this.authService.getUserId())
    .then((data: any) => {
      console.log(data)
      let cls = data.data;
      this.classes.next(cls)
      this.fillInfo();
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

  getAdminClasses(){
    // console.log(this.authService.getSchoolId())
    this.subjectsManagerService
    .getAdminClassesDittofi(1)
    .then((data: any) => {
      console.log(data)
      let cls = data.data;
      this.classes.next(cls)
      this.fillInfo();
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
  removeSelectedClass(i: number){
    let temp = [];
    const removedClass = this.selectedClasses[i];

    if (this.selectedClasses.includes(removedClass)) {
      this.selectedClasses = this.selectedClasses.filter(
        (a) => a.id != removedClass.id
      );
    }
    for (let subject of this.selectedSubjects) {
      if (removedClass.id != subject.classId) {
        console.log(subject)
      console.log(removedClass)
      console.log('----------------')
        temp.push(subject);
      }
    }
    this.selectedSubjects = temp;
    temp = []
    for (let subject of this.subjects) {
      if (removedClass.id != subject.classId) {

        temp.push(subject);
      }
    }
    this.subjects = temp;
    if(this.subjects.length == 0){
      this.selectedSubjects = [];
      this.assessments = []
    }
    let tempAsst = []
    for(let asst of this.assessments){
      if(asst.class.id != removedClass.id){
        tempAsst.push(asst)
      }
    }
    this.assessments = tempAsst
  }

  addSelectedSubjects(e){
    console.log(e)
    console.log(this.tempAssessments)
    const duplicateSubjects = [];
    for(let sub of this.subjectsAll){
      if(sub.name === e.name){
        duplicateSubjects.push(sub.id);
      }
    }

    this.assessmentManagerService.getSubjectAssessmentsDittofi(e.id).then((res: any) => {

      console.log(res)
      const tempAsst = res.data;
      console.log(tempAsst)

      for(let asst of tempAsst){
        console.log(this.subjectsAll)
        const subject = this.subjectsAll.find(item => item.id == asst.subject_id);
        const id = this.subjectsAll.findIndex(item => item.id == asst.subject_id);
        asst.checked = false;


        const cls = this.classes.getValue().find(item => item.id == subject.classId);
        console.log(cls)
        asst.class = cls;

        asst.subject = e
        if(asst.is_published){
          asst.status = 'Published';

        }
        else{
          asst.status = 'Pending';

        }

        // const format = 'dd MMM yyyy hh:mm a';
        // const locale = 'en-US';
        // const startDate = formatDate(asst.startsAtDateTime, format, locale);
        // const endDate = formatDate(asst.endsAtDateTime, format, locale);

        const dateStartDate = new Date(asst.from_date)
        const dateEndDate = new Date(asst.to_date)

        const from = new DatePipe('en-Us').transform(dateStartDate, 'dd MMM yyyy hh:mm a');
        const to = new DatePipe('en-Us').transform(dateEndDate, 'dd MMM yyyy hh:mm a');


        asst.from_date = from;
        asst.to_date = to;
      }

      this.assessments = this.assessments.concat(tempAsst);
      this.assessments = this.assessments.sort((item1, item2) =>
      new Date(item1.from_date) < new Date(item2.from_date) ? 1 : -1
    );
      this.tempAssessments = this.assessments;

      console.log(res)

      this.fillInfo();


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

  fillInfo(){
    const body = {
      assessments: this.tempAssessments,
      selectedClasses: this.selectedClasses,
      selectedSubjects: this.selectedSubjects,
      classes: this.classes,
      subjects: this.subjects
    }

    console.log(body)
    this.assessmentManagerService.viewAssessementsObject$.next(body);
  }

  removeSelectedSubjects(i: number) {

    const removedSubject = this.selectedSubjects[i];
    console.log(removedSubject)
    console.log(this.tempAssessments)

    let tempAsst = []
    for(let j = 0; j < this.tempAssessments.length; j++){

      if(this.tempAssessments[j].subject_id != removedSubject.id){
        tempAsst.push(this.tempAssessments[j])
      }
    }
    this.tempAssessments = tempAsst
    this.assessments = this.tempAssessments
    if (this.selectedSubjects.includes(removedSubject)) {
      this.selectedSubjects = this.selectedSubjects.filter(
        (a) => !(a === removedSubject)
      );
    }
  }


  FilterByDate() {
    console.log('hello')
    let startDate = this.dateRange.value.start;
    let endDate = this.dateRange.value.end;
    let toDateStart = new Date(startDate);
    let toDateEnd = new Date(endDate);
    let endOfTheDay = new Date(toDateEnd.getFullYear()
                              ,toDateEnd.getMonth()
                              ,toDateEnd.getDate()
                              ,23,59,59);



    if (endDate === null) {
      const startDate = new Date(this.dateRange.value.start);
      let customDate = new Date(startDate);
      customDate.setFullYear(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      customDate.setHours(23, 59, 59, 59);
      toDateEnd = customDate;
      this.dateRange.setValue({ start: startDate, end: customDate });
    }
    try {
      this.assessments = this.tempAssessments
      this.assessments = this.assessments.filter((item: any) => {

        console.log(new Date(item.from_date))
        console.log(endOfTheDay)
        console.log('---------------------------------')
        return (
          new Date(item.from_date) >= toDateStart &&
          new Date(item.from_date) <= endOfTheDay
        );
      }
      );
      this.currentPage = 1;
    } catch (e) {}
  }

  editDialog(index: number){
    const newIndex = (this.currentPage - 1)*10 + index;

    if(this.assessments[newIndex].is_published == true){
      this.DialogSerivce.openDialog({
        title: 'You cannot edit a published assessment',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
        }
        });
    }
    else{
      this.assessments[newIndex].edit = !this.assessments[newIndex].edit
    this.assessmentManagerService.editedAssessment$.next(this.assessments[newIndex]);
        this.router.navigate(['../assessment/viewAssessments/createAssessment']);
        // this.router.navigateByUrl('assessment/assessmentResults')

    }


  }

  editAssessment(){

  }
  deleteAssessment(assessment){

    if(assessment.is_published == true){
      this.DialogSerivce.openDialog({
        title: 'You cannot delete a published assessment',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
        }
        });
    }
    else{
 this.DialogSerivce.openDialog({
      title: 'Are you sure you want to delete this assessment?',
      message: 'test',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {

        this.assessments = this.assessments.filter((item) => {
          return (item.id != assessment.id);
        })
          this.assessmentManagerService.deleteAssessmentDittofi(assessment.id, this.authService.getUserId()).then((res) =>{

            this.assessments = this.assessments.filter((item) => {
              return (item.id != assessment.id);
            })
            this.tempAssessments = this.tempAssessments.filter((item) => {
              return (item.id != assessment.id);
            })
            this.DialogSerivce.openDialog({
              title: 'Assessment Deleted Successfully',
              message: 'test',
              confirmText: 'Okay',
              cancelText: 'Cancel',
              oneButton: true,
              DidConfirm: () => {

              }
            });

          }).catch((res) => {


            console.log(res.error.error.message);
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
      }
    });
    }


  }
  publishUnpublishAssessment(index: number){
    const date = new Date();
    const newIndex = (this.currentPage - 1)*10 + index;
    const asstStartTime = this.assessments[newIndex].from_date;
    const newDate = new Date(asstStartTime);

    console.log(date);
    console.log(newDate.toLocaleString());
    console.log((date > newDate))

    if(date > newDate){
      this.DialogSerivce.openDialog({
        title: 'You cannot publish/unpublish this assessment because the deadline has passed',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {
        }
      });
    }
    else{
      if(this.assessments[newIndex].is_published){
        //call unpublish API
        this.assessmentManagerService.publishAssessmentDittofi(this.assessments[newIndex].id, false).then((res) => {
          this.assessments[newIndex].is_published = false;
          this.assessments[newIndex].status = 'Pending';


        }).catch((res) => {
          console.log(res);
          let finalErr = 'Internal Server Error'
          if(res.error.error != undefined){
            finalErr = res.error.error.message;
          }
          console.log(res);

          console.log(res.error.error.message);
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
      else{
        //call publish API

        this.assessmentManagerService.publishAssessmentDittofi(this.assessments[newIndex].id, true).then((res) => {
          console.log(res)
          this.assessments[newIndex].is_published = true;
          this.assessments[newIndex].status = 'Published';

        }).catch((res) => {
          console.log(res);
          let finalErr = 'Internal Server Error'
          if(res.error.error != undefined){
            finalErr = res.error.error.message;
          }
          console.log(res);

          console.log(res.error.error.message);
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



  }

  searchAssessments(e){
    console.log(e)
    console.log(this.tempAssessments)
    this.assessments = this.tempAssessments;
    if (e.value != '') {
      this.assessments = this.assessments.filter((res) => {
        console.log(res.title.toLocaleLowerCase());
        console.log(e.value.toLocaleLowerCase())
        return res.title
          .toLocaleLowerCase()
          .match(e.value.toLocaleLowerCase());
      });
    }
  }

  checkAssessment(index: number){
    const newIndex = (this.currentPage - 1)*10 + index;
    console.log(this.assessments[newIndex].checked)

  }


  cancelDates(){
    console.log(this.tempAssessments)
    this.assessments = this.tempAssessments;
     // Setup default date
     var DefaultDate = new Date();
     // Default is 7 days after today
     DefaultDate.setDate(DefaultDate.getDate() + 7);
     this.dateRange.setValue({ start: null, end: null });
     this.dateRange.updateValueAndValidity();
  }

  FilterByClass(grade: string[]) {
    console.log('entered')
    console.log(this.selectedClass)
    let resultArr = [];
    this.currentPage = 1;
    console.log(this.filterControl);
    if (grade.includes('All') || grade.length === 0) {
      resultArr = this.tempAssessments;
      this.assessments = resultArr;
      console.log(resultArr);
      this.changePage();
      return;
    }
    if (this.assessments.length >= 1) {
      for (let i = 0; i < this.tempAssessments.length; i++) {
        if (grade.includes(this.tempAssessments[i].sectionID)) {
          resultArr.push(this.tempAssessments[i]);
        }
      }
      this.assessments = resultArr;
      this.changePage();
    } else {
      for (let i = 0; i < this.tempAssessments.length; i++) {
        resultArr.push(this.tempAssessments[i]);
      }
    }
  }
  didClickFilterByButton() {
    this.FilterFormField.open();
  }

  generateUniqueClasses() {
    try {
      const unique = [
        ...new Set(
          this.assessments.map((item) => item.sectionID)
        ),
      ];
      const resultArr = [];
      resultArr[0] = 'All';
      for (var i of unique) {
        resultArr.push(i);
      }
      // this.filterControl.setValue(['Section 1']);
      // this.filterControl.updateValueAndValidity();
      console.log(this.filterControl);

      resultArr.sort();
      return resultArr;
    } catch (err) {
      console.log(
        'There was an error generating unique classes.. unique classes has been disabled for now'
      );
      return [];
    }
  }

  changePage() {
    if (this.currentPage === 1) {
      this.StartIndex = 1;
      this.showNumber();
      return;
    }
    this.StartIndex = (this.currentPage - 1) * 3 + 1;
    this.showNumber();
  }

  showNumber() {
    //Check if a filter is already inplace
    if (this.assessments != undefined) {
      if (3 > this.assessments.length) {
        this.EndIndex = this.assessments.length;
        return;
      }
    }
    if (3 > this.assessments.length) {
      this.EndIndex = this.assessments.length;
      return;
    }
    this.EndIndex = this.StartIndex + (3 - 1);
  }

  addNewAssessmentPressed(){
    this.assessmentManagerService.editedAssessment$.next(null);
  }

  onPressAssessement(assessment: any){
    this.assessmentManagerService.assessmentData$.next(assessment);
    this.router.navigateByUrl('assessment/assessmentResults')
    this.router.navigate(['assessment/assessmentResults', assessment.id]);
  }

  bulkDel(){
    this.deleteSelected = []
    for(let asst of this.assessments){
      if(asst.checked == true){
        this.deleteSelected.push(asst);
      }
    }
    if(this.deleteSelected.length == 0){
      this.DialogSerivce.openDialog({
        title: 'No selected assessments',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {

        }
      });
    }
    else{
      let publish = false;
      for(let asst of this.deleteSelected){
        if(asst.is_published == true){
          publish = true
            this.DialogSerivce.openDialog({
              title: 'You cannot delete a published assessment',
              message: 'test',
              confirmText: 'Okay',
              cancelText: 'Cancel',
              oneButton: true,
              DidConfirm: () => {
                return;
              }
              });
        }
      }
      if(publish == false){
        this.DialogSerivce.openDialog({
          title: 'Are you sure you want to delete the selected assessments?',
          message: 'test',
          confirmText: 'Delete',
          cancelText: 'Cancel',
          oneButton: false,
          DidConfirm: () => {
            for(let asst of this.deleteSelected){
              this.assessmentManagerService.deleteAssessmentDittofi(asst.id, this.authService.getUserId()).then((res) =>{

                  this.assessments = this.assessments.filter((item) => {
                    return (item.id != asst.id);
                  })
                  this.tempAssessments = this.tempAssessments.filter((item) => {
                    return (item.id != asst.id);
                  })


              }).catch((res) => {


                console.log(res.error.error.message);
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
            }
          }})
      }





    }


  }
  checkAllAssessments(){
    if(this.checkAll == true){
      this.checkAll = false
      for(let asst of this.assessments){
        asst.checked = false;
      }
    }
    else{
      this.checkAll = true
      for(let asst of this.assessments){
        asst.checked = true;
      }
    }
  }

}
