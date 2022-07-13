import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from '../../../Models/Subject';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { Class } from 'src/app/modules/Models/Class';
import { AcademicClass } from 'src/app/modules/Models/AcademicClass';
import { Section } from 'src/app/modules/Models/Section';
import { School } from 'src/app/modules/Models/school';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { EmployeeManagerService } from 'src/app/modules/_services/employee-manager.service';
import { rejects } from 'assert';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css'],
})
export class SubjectsComponent implements OnInit {
  classes: AcademicClass[] = [];
  selectedClasses: Class[] = [];
  tempselectedClasses: Class[] = [];
  classSections: Section[] = [];
  selectedSubjects: Subject[] = [];

  currentSubject: Subject;
  subjects: any[] = [];
  tempSub: any[] = [];
  enableAddSubject: boolean;

  PageBuffer = 1;

  currentPage = 1;
  schoolId = '';
  nameCode: string = '';
  isDragging: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  //SidePanel
  tempClasses = new Map();
  obj: any[] = [];

  AssignedTeachers = [];

  SelectedSection = {
    SubjectTitle: 'SubjectX',
    SectionTitle: 'unknown',
    Employees: null,
    Employee: null,
    Selecteduser: null,
    SelectedEmployeeSubjectReference: null,
    expand: false,
  };

  @ViewChild('ngg') Select;
  subjectCredentials = new Subject();

  constructor(
    private schoolService: SchoolManagerService,
    private employeeManager: EmployeeManagerService,
    private DialogSerivce: DialogServiceService,
    private subjectsManagerService: SubjectsManagerService,
    private authManager: AuthManagerService,
    private academicYearService: AcademicClassService
  ) {}

  ngOnInit(): void {
    this.schoolId = 1 + '';
    this.getClasses();
    console.log(this.classSections);
  }

  didAddClass(e, isNew) {
    // console.log('fired!');
    // if (isNew) {
    //   if (e.length == 0) {
    //     this.selectedClasses = [];
    //     this.subjects = [];
    //   } else {
    //     this.selectedClasses = [...e];
    //   }
    // } else {
    //   this.selectedClasses = [...e];
    // }
  }

  // getClasses(){
  //   this.subjectsManagerService.getAllClasses(this.schoolId).then((res : any) => {
  //     this.classes = res.classes;
  //     console.log(this.classes);
  //   }
  // }
  dragEnter(event) {
    this.isDragging.next(true);
    console.log(event);
    console.log(this.subjects)
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.subjects,
      event.previousIndex + (this.currentPage - 1) * 10,
      event.currentIndex + (this.currentPage - 1) * 10
    );
    console.log(event.previousIndex);
    console.log(event.currentIndex);
    console.log(event.previousIndex + (this.currentPage - 1) * 10);
    console.log(event.currentIndex + (this.currentPage - 1) * 10);
    this.isDragging.next(false);

    // const pg = event.currentIndex / 10;
    // this.currentPage = parseInt(String(pg)) + 1;
    // console.log(this.currentPage)
  }
  async didClickSubjectRow(index) {
    this.SelectedSection.SelectedEmployeeSubjectReference =
      this.subjects[index];
    console.log(this.subjects[index]);

    if (this.subjects[index].expand == true) {
      this.subjects[index].expand = false;
      this.SelectedSection.expand = false;
    } else {
      for (let i = 0; i < this.subjects.length; i++) {
        this.subjects[i].expand = false;
        this.SelectedSection.expand = false;
      }
      this.subjects[index].expand = true;
      this.SelectedSection.expand = true;
    }
    this.SelectedSection.SubjectTitle = this.subjects[index].name;
    this.SelectedSection.SectionTitle = this.subjects[index].sectionName;
    this.SelectedSection.Employees = (
      (await this.employeeManager.GetAllEmployeesDittofi(
        this.schoolService.getCurrentSchoolID()
      )) as any
    ).data;

    console.log(this.SelectedSection)
    for (let i = 0; i < this.SelectedSection.Employees.length; i++) {
      this.SelectedSection.Employees[i].displayName =
        this.SelectedSection.Employees[i].first_name +
        '(' +
        this.SelectedSection.Employees[i].dep_name+
        ')';
      console.log(this.SelectedSection.Employees[i].displayName);
    }
  }
  didSelectEmployee(element) {
    // this.SelectedSection.Employees.forEach((element) => {
      console.log(element);
      console.log(this.SelectedSection)
      // if (element.userId === this.SelectedSection.Selecteduser.id) {
        console.log('success..');
        this.SelectedSection.Employee = element;
        this.SelectedSection.Selecteduser = element
      // }
    // });
  }
  AttemptToAssign() {
    Object.keys(this.SelectedSection).forEach((element) => {
      if (element === null) {
        console.log(
          'An Internal Error Occurred... One of the values is null....'
        );
        return;
      }
    });
    if (
      this.AssignedTeachers.find(
        (element) => element === this.SelectedSection.Employee
      ) === undefined
    ) {
      console.log(this.SelectedSection)
      this.subjectsManagerService
        .assignSubjectToEmployeeDittofi(
          this.schoolService.getCurrentSchoolID(),
          this.SelectedSection.Employee.id,
          this.SelectedSection.SelectedEmployeeSubjectReference.id,
          this.SelectedSection.SelectedEmployeeSubjectReference.section_id
        )
        .then((res) => {
          this.DialogSerivce.openDialog({
            title: 'Assigned Successfully.',
            message: 'MESSAGE DIALOG',
            confirmText: 'Ok',
            cancelText: 'Cancel DIALOG',
            oneButton: true,
            DidConfirm: () => {},
          });
          this.AssignedTeachers.push(this.SelectedSection.Employee);
          this.SelectedSection.Selecteduser = null;
          console.log(res);
        })
        .catch((err) => {
          console.log(err)
          this.DialogSerivce.openDialog({
            title: 'A server error has occurred',
            message: 'MESSAGE DIALOG',
            confirmText: 'Ok',
            cancelText: 'Cancel DIALOG',
            oneButton: true,
            DidConfirm: () => {},
          });
        });
    } else {
      this.DialogSerivce.openDialog({
        title: 'Already exists..',
        message: 'MESSAGE DIALOG',
        confirmText: 'Ok',
        cancelText: 'Cancel DIALOG',
        oneButton: true,
        DidConfirm: () => {},
      });
      this.SelectedSection.Selecteduser = null;
    }
  }
  didClickDeleteEmployee(employee) {
    //you should use an api call but it remains local for now..

    this.AssignedTeachers = this.AssignedTeachers.filter(
      (obj) => obj !== employee
    );
  }

  getClasses() {
    this.academicYearService
    .getAllCAYDittofi(this.schoolService.getCurrentSchoolID())
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

  addTagPromise = () => {};

  getSelectedSubjects(class_id){
    this.subjectsManagerService
      .getClassSubjectsDittofi(this.schoolService.getCurrentSchoolID(), class_id)
      .then((res: any) => {
        console.log(res);
        const tempSubjects = res.data;
        for (let i = 0; i < tempSubjects.length; i++) {
          tempSubjects[i].classId = class_id;
          tempSubjects[i].sectionName = tempSubjects[i].section_code;
        }
        this.subjects = this.subjects.concat(tempSubjects);
        this.subjects = this.subjects.sort((item1, item2) =>
          item1.subject_order > item2.subject_order ? 1 : -1
        );
        this.tempSub = this.subjects;
        console.log(this.subjects)
      })
      .catch((res) => {
        console.log('reject');

        console.log(res);
      });
  }
  getSelectedClassSubjects(u) {
    this.currentPage = 1;
    this.tempselectedClasses = this.selectedClasses;
    console.log('-------------------------');
    console.log(this.tempselectedClasses);
    console.log(this.selectedClasses);
    if (this.selectedClasses.length > 0) {
      const selectedC = this.selectedClasses[this.selectedClasses.length - 1];
      this.getSelectedSubjects(selectedC.id)
      this.getSectionsPerClass(selectedC.id);

    }
  }

  // removeClassSubjects() {
  //   const temp = [];
  //   for (let cls of this.tempselectedClasses) {
  //     if (this.selectedClasses.includes(cls)) {
  //       console.log(cls.name);
  //       for (let subject of this.subjects) {
  //         if (cls.id === subject.classId) {
  //           temp.push(subject);
  //         }
  //       }
  //     }
  //   }

  //   console.log(temp.length);

  //   this.subjects = temp;
  // }

  removeSelectedSubjects(i: number) {
    this.currentPage = 1;
    const temp = [];
    const removedClass = this.selectedClasses[i];

    console.log('before removed class');
    console.log(removedClass.name);
    console.log(this.selectedClasses);
    if (this.selectedClasses.includes(removedClass)) {
      this.selectedClasses = this.selectedClasses.filter(
        (a) => !(a === removedClass)
      );
    }
    console.log('after removed class');
    console.log(this.selectedClasses);
    for (let subject of this.subjects) {
      if (removedClass.id != subject.classId) {
        temp.push(subject);
      }
    }
    console.log(temp);
    this.subjects = temp;
  }

  showDeleteDialog(subject: Subject) {
    this.DialogSerivce.openDialog({
      title: 'Are you sure you want to delete this subject?',
      message: 'test',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {
        this.subjectsManagerService
          .deleteSubjectDittofi(subject)
          .then((res) => {
            console.log('deleted deleted');
            const ElementToBeDeleted: Subject = this.subjects.find(
              ({ id }) => id == subject.id
            );
            this.subjects.splice(
              this.subjects.findIndex((a) => a.id == ElementToBeDeleted.id),
              1
            );

            this.DialogSerivce.openDialog({
              title:
                'Subject with name: ' +
                subject.name +
                ' has been deleted Successfully',
              message: 'MESSAGE DIALOG',
              confirmText: 'Ok',
              cancelText: 'Cancel DIALOG',
              oneButton: true,
              DidConfirm: () => {},
            });
          })
          .catch((res) => {
            this.DialogSerivce.openDialog({
              title: res.error.message,
              message: 'MESSAGE DIALOG',
              confirmText: 'Ok',
              cancelText: 'Cancel DIALOG',
              oneButton: true,
              DidConfirm: () => {},
            });
          });
      },
    });
  }

  hideDialog() {
    const dialog = document.getElementById('modal');
    dialog.classList.remove('is-active');
  }

  getSelectedItems(index: number, checked: boolean) {
    if (checked) {
      this.selectedSubjects.push(this.subjects[index]);
    } else {
      const subIndex = this.selectedSubjects.indexOf(this.subjects[index], 0);
      this.selectedSubjects.splice(subIndex, 1);
    }

    console.log(this.selectedSubjects);
  }
  enableEditDialog(index: number) {
    this.enableAddSubject = false;
    console.log(this.subjects[index].edit);
    this.subjectCredentials = this.subjects[index];

    for (let i = 0; i < this.classSections.length; i++) {
      if (this.classSections[i].id == this.subjects[index].sectionId) {
        this.subjectCredentials.sections = [];
        this.subjectCredentials.sections.push(this.classSections[i]);
      }
    }
    if (this.subjects[index].edit == true) {
      this.subjects[index].edit = false;
    } else {
      for (let i = 0; i < this.subjects.length; i++) {
        this.subjects[i].edit = false;
      }

      this.subjects[index].edit = true;
    }
  }

  editSubject(index: number) {
    console.log(this.subjectCredentials);
    this.subjectsManagerService
      .editSubjectsDittofi(
        this.subjectCredentials
      )
      .then((res) => {
        this.subjects[index].edit = false;
        this.subjects[index] = this.subjectCredentials;
        console.log(res);
        this.DialogSerivce.openDialog({
          title: 'Subject edited successfully',
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((res) => {
        console.log(res)
        this.DialogSerivce.openDialog({
          title: res.error,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  addSubjectDialog() {
    for (let i = 0; i < this.subjects.length; i++) {
      this.subjects[i].edit = false;
    }
    this.subjectCredentials = new Subject();
    if (this.selectedClasses.length == 0) {
      this.DialogSerivce.openDialog({
        title: 'Please select a class',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    } else {
      if (this.enableAddSubject) {
        this.enableAddSubject = false;
      } else {
        this.enableAddSubject = true;
      }
    }
  }
  removeAll(e) {
    if (e.length == 0) {
      this.selectedClasses = [];
      this.subjects = [];
    }
  }
  orderSubjects(sections) {
    const selectedOrders = new Map();
    for (let temp of sections) {
      console.log(temp)
      if (selectedOrders.has(temp.class_of_academic_year_id)) {
        const secArrays = selectedOrders.get(temp.class_of_academic_year_id);
        const obj = {
          sec: temp,
          order: secArrays[secArrays.length - 1].order + 1,
        };
        secArrays.push(obj);

        selectedOrders.set(temp.class_of_academic_year_id, secArrays);
      } else {
        const count = this.countSubjectOccurance(temp.class_of_academic_year_id);
        const obj = {
          sec: temp,
          order: count + 1,
        };

        selectedOrders.set(temp.class_of_academic_year_id, [obj]);
      }
    }
    return selectedOrders;
  }
  createNewSubject() {
    console.log(this.subjectCredentials.sections);
    this.tempClasses = this.orderSubjects(this.subjectCredentials.sections);

    this.subjectsManagerService
      .createSubjectDittofi(this.schoolId, this.subjectCredentials, this.tempClasses)
      .then((res: any) => {
        this.enableAddSubject = false;
        console.log(res);
        console.log(this.subjectCredentials)
        console.log(this.tempClasses)
        const newSub = res.data;
        
        console.log(this.selectedClasses)
        this.subjects = [];
        for(let i = 0; i < this.selectedClasses.length; i++){
          this.getSelectedSubjects(this.selectedClasses[i].id)
        }

        // const tempSubjects = [];
        // for (let sub of newSub) {
        //   const section = this.classSections.find(
        //     (elem) => elem.id === sub.sectionId
        //   );

        //   console.log('section section');
        //   console.log(section);
        //   const sectionName = section.code;
        //   sub.sectionName = sectionName;
        //   sub.sectionId = section.id;
        //   sub.expand = false;
        //   sub.edit = false;

        //   tempSubjects.push(sub);
        // }

        // this.subjects = this.subjects.concat(tempSubjects);

        console.log(this.subjects);
        this.DialogSerivce.openDialog({
          title: 'Subject was created successfully',
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((res) => {
        console.log(res);
        const err = res.error.message;
        this.DialogSerivce.openDialog({
          title: err,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });

        console.log(res);
      });
  }
  cancelEditForm(index: number) {
    this.subjects[index].edit = false;
  }
  searchAcademicYear() {
    const temp = this.subjects;
    if (this.nameCode != '') {
      this.subjects = this.subjects.filter((res) => {
        return res.code
          .toLocaleLowerCase()
          .match(this.nameCode.toLocaleLowerCase());
      });
    } else if (this.nameCode === '') {
      this.subjects = this.tempSub;
    }
  }

  getSectionsPerClass(classId: string) {
    this.subjectsManagerService
      .getClassSectionsDittofi(this.schoolService.getCurrentSchoolID(), classId)
      .then((res: any) => {
        console.log(res);

        const tempSections = res.data;

        for (let i = 0; i < tempSections.length; i++) {
          tempSections[i].displayName =
            tempSections[i].code 
        }
            // '(' +
            // tempSections[i].classOfAcademicYear.name +
            // ')';
        // }

        this.classSections = this.classSections.concat(tempSections);
      })
      .catch((res) => {
        console.log('reject1');
        console.log(res);
      });
  }

  sortByName() {
    console.log('entered');
    const arrow = document.getElementById('nameArrow');
    if (arrow.classList.contains('fa-caret-down')) {
      arrow.classList.remove('fa-caret-down');
      arrow.classList.add('fa-caret-up');
      this.subjects.sort((item1, item2) => (item1.name < item2.name ? 1 : -1));
    } else if (arrow.classList.contains('fa-caret-up')) {
      arrow.classList.remove('fa-caret-up');
      arrow.classList.add('fa-caret-down');
      this.subjects.sort((item1, item2) => (item1.name > item2.name ? 1 : -1));
    }
  }
  sortByCode() {
    console.log('entered');
    const arrow = document.getElementById('codeArrow');
    if (arrow.classList.contains('fa-caret-down')) {
      arrow.classList.remove('fa-caret-down');
      arrow.classList.add('fa-caret-up');
      this.subjects.sort((item1, item2) => (item1.code < item2.code ? 1 : -1));
    } else if (arrow.classList.contains('fa-caret-up')) {
      arrow.classList.remove('fa-caret-up');
      arrow.classList.add('fa-caret-down');
      this.subjects.sort((item1, item2) => (item1.code > item2.code ? 1 : -1));
    }
  }
  sortByOrder() {
    console.log('entered');
    const arrow = document.getElementById('orderArrow');
    if (arrow.classList.contains('fa-caret-down')) {
      arrow.classList.remove('fa-caret-down');
      arrow.classList.add('fa-caret-up');
      this.subjects.sort((item1, item2) =>
        item1.subjectOrder < item2.subjectOrder ? 1 : -1
      );
    } else if (arrow.classList.contains('fa-caret-up')) {
      arrow.classList.remove('fa-caret-up');
      arrow.classList.add('fa-caret-down');
      this.subjects.sort((item1, item2) =>
        item1.subjectOrder > item2.subjectOrder ? 1 : -1
      );
    }
  }
  // sortBySection(){
  //   this.subjects.sort( (item1, item2) => item1.section.code > item2.section.code? 1: -1)
  // }

  getDepartmentNames(employee: any) {
    console.log('+++++++++++++++++++++++');
    console.log(employee);
    if (employee != null) {
      var depNames = '';
      if (employee.departments.length == 0) {
        return '-';
      } else if (employee.departments.length == 1) {
        return employee.departments[0].name;
      } else {
        depNames = employee.departments[0].name;
        for (let i = 1; i < employee.departments.length; i++) {
          depNames = depNames + ', ' + employee.departments[i].name;
        }
        return depNames;
      }
    }
  }
  // removeOrder(event){
  //   console.log(event)
  //   if(this.tempClasses.has(event.value.classOfAcademicYear.id)){
  //     const t1 = this.obj.find((item) => item.id === event.value.id)

  //     console.log(t1)
  //     console.log(this.tempClasses.get(event.value.classOfAcademicYear.id))

  //     const tempArr = this.tempClasses.get(event.value.classOfAcademicYear.id);
  //     tempArr.splice(t1.classOrder, 1)
  //     for(let i =t1.classOrder; i< tempArr.length; i++){
  //       tempArr[i] = tempArr[i] - 1
  //     }

  //     this.tempClasses.set(event.value.classOfAcademicYear.id, tempArr)

  //     console.log(this.tempClasses)

  //   }

  // }
  // chooseOrder(event){
  //   console.log(event)

  //     var count = this.countSubjectOccurance(event.classOfAcademicYear.id);

  //     if(this.tempClasses.has(event.classOfAcademicYear.id)){
  //       const tempArr = this.tempClasses.get(event.classOfAcademicYear.id)
  //       tempArr.push(tempArr[tempArr.length - 1] + 1)
  //       this.tempClasses.set(event.classOfAcademicYear.id, tempArr)
  //       console.log(tempArr)

  //       console.log(this.tempClasses)

  //     }
  //     else{
  //       var cn = count + 1;
  //       const tempArr2 = [cn]
  //       this.tempClasses.set(event.classOfAcademicYear.id, tempArr2)

  //     }

  //     console.log(this.tempClasses.get(event.classOfAcademicYear.id))
  //     var test = {
  //       id: event.id,
  //       classId: event.classOfAcademicYear.id,
  //       index: this.subjectCredentials.sections.length - 1,
  //       order: this.tempClasses.get(event.classOfAcademicYear.id)[this.tempClasses.get(event.classOfAcademicYear.id).length - 1],
  //       classOrder: this.tempClasses.get(event.classOfAcademicYear.id).length - 1

  //     }

  //     this.obj.push(test)
  //     console.log(this.tempClasses)
  //     console.log('--------------------------')
  //     console.log(this.obj)

  // }
  countSubjectOccurance(classId: string) {
    var count = 0;
    for (let sub of this.subjects) {
      if (sub.classId === classId) {
        count = count + 1;
      }
    }
    console.log(count);
    return count;
  }
}
