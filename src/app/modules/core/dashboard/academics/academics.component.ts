import { Component, OnInit } from '@angular/core';
import { AcademicYear } from '../../../Models/AcademicYear';
import { AcademicClass } from '../../../Models/AcademicClass';
import { AcademicYearManagerService } from 'src/app/modules/_services/academic-year-manager.service';
import { DatePipe } from '@angular/common';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import * as moment from 'moment';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';
import { SectionManagerService } from 'src/app/modules/_services/section-manager.service';
import { Section } from 'src/app/modules/Models/Section';
import { CycleManagerService } from 'src/app/modules/_services/cycle-manager.service';
import { Cycle } from 'src/app/modules/Models/Cycle';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormControl, UntypedFormBuilder, NgSelectOption } from '@angular/forms';

@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.css'],
  animations: [
    trigger('widthGrow', [
        state('closed', style({
            width: 0,
        })),
        state('open', style({
            width: 400
        })),
        transition('* => *', animate(200))
    ]),
]
})
export class AcademicsComponent implements OnInit {
  academicYears: AcademicYear[] = [];
  tempAcademicYears: AcademicYear[] = [];
  yearClasses: AcademicClass[] = [];
  cycles: Cycle[] = [];
  currentYear: AcademicYear;
  academicIndex: number;
  currentAcademicClass = new AcademicClass();
  selected: AcademicClass[] = [];
  yearCode: string = '';
  public test1: string = '';
  loading = false;
  schoolId = '';
  sections: any[] = []
  currentPage = 1;
  classNb = 0;
  state = "closed";
  cycleIndex = 0;

   //filter by date
   dateRange = this._formBuilder.group({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  editClass = false;
  cyclesBool = false;
  academicClassCredentials = new AcademicClass();
  newYearCredentials = new AcademicYear();
  editYearCredentials = new AcademicYear();
  sectionCredentials = new Section();
  cycleCredentials = new Cycle();

  enablePagination = true;
  isDragging: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(private academicYearService: AcademicYearManagerService, private datePipe: DatePipe,
     private DialogSerivce:DialogServiceService, private academicClassService: AcademicClassService,
     private sectionManagerService: SectionManagerService, private cycleManagerService: CycleManagerService, private authManager: AuthManagerService,
     private subjectsManagerService: SubjectsManagerService, private _formBuilder: UntypedFormBuilder,
     ) { }

  ngOnInit(): void {
    this.schoolId = this.authManager.getSchoolId();
    this.getAllacademicYears(1);
    this.getSchoolCycles();
  }

  getAllacademicYears(schoolId) {
    this.academicYearService
      .getAllAcademicYearsDittofi(schoolId)
      .then((data: any) => {
        console.log(data)
        const years = data.data;
        console.log(years.length);
        for (let i = 0; i < years.length; i++) {
          years.classes = this.yearClasses;

          years[i].edit = false;
          years[i].expand = false;



          if(years[i].cays != null){
            for (let j = 0; j < years[i].cays.length; j++) {
              if (years[i].cays[j].Cycle == null) {
                years[i].cays[j].Cycle = new Cycle();
                years[i].cays[j].Cycle.code = years[i].cays[j].cycle_name
                years[i].cays[j].Cycle.id = years[i].cays[j].cycle_id

              }
            }
          }

        }

        years[0].classes = this.yearClasses;
        this.academicYears = years;
        this.tempAcademicYears = years;


      })
      .catch((res) => {
        this.DialogSerivce.openDialog({
          title: res,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });


      });
  }

  sortCodeASC() {
    this.academicYears.sort((item1, item2) =>
      item1.code.toLocaleLowerCase() > item2.code.toLocaleLowerCase() ? 1 : -1
    );
  }

  sortStartASC() {
    this.academicYears.sort((item1, item2) =>
      new Date(item1.start_date).valueOf() - new Date(item2.start_date).valueOf()
    );
  }
  sortEndASC() {
    this.academicYears.sort((item1, item2) =>
      item1.end_date > item2.end_date ? 1 : -1
    );
  }

  HandleDeleteAcademicYear(academicYear: AcademicYear) {
    this.DialogSerivce.openDialog({
      title: 'Are you sure you want to delete this academic year?',
      message: 'test',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {
        this.academicYearService
          .deleteAcademicYearDittofi(academicYear)
          .then((res) => {
            const ElementToBeDeleted: AcademicYear = this.academicYears.find(
              ({ id }) => id == academicYear.id
            );
            this.academicYears.splice(
              this.academicYears.findIndex(
                (a) => a.id == ElementToBeDeleted.id
              ),
              1
            );
            this.DialogSerivce.openDialog({
              title: 'Academic Year: '+academicYear.code + ', has been deleted Successfully',
              message: 'MESSAGE DIALOG',
              confirmText: 'Ok',
              cancelText: 'Cancel DIALOG',
              oneButton: true,
              DidConfirm: () => {},
            });
          })
          .catch((res) => {
            console.log(res)
              this.DialogSerivce.openDialog({
                title: res.error.message,
                message: 'test',
                confirmText: 'Okay',
                cancelText: 'Cancel',
                oneButton: true,
                DidConfirm: () => {},
              });

          });
      },
    });
  }

  changeDateFormat(date: Date) {
    const newDate = this.datePipe.transform(date, 'dd-MM-yyyy');

    return newDate;
  }
  createNewAcademicYear() {

    console.log("academic yearss")
        console.log(this.academicYears)
        let sameNameDate = false;


          for(let i = 0; i < this.academicYears.length; i++){
            let start_date1 = new Date(this.academicYears[i].start_date)
            let start1 = start_date1.toISOString();

            let start_date2 = new Date(this.newYearCredentials.start_date)
            let start2 = start_date2.toISOString();

            if(this.academicYears[i].code.toLocaleLowerCase() == this.newYearCredentials.code.toLocaleLowerCase()){
              console.log("entered entered")
              console.log(this.newYearCredentials.start_date)
              console.log(this.academicYears[i].code.toLocaleLowerCase())

              sameNameDate = true;
            }
            else if(start1 == start2){
              console.log("entered entered")
              console.log(start1)
              console.log(start2)
              sameNameDate = true
            }
          }


          let now = new Date();
          let start_select = new Date(this.newYearCredentials.start_date);
          let end_select = new Date(this.newYearCredentials.end_date);



        if(start_select < now || end_select < now){
          this.DialogSerivce.openDialog({
            title: "Dates cannot be in the past",
            message: 'test',
            confirmText: 'Okay',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {},
          });
        }
        else if(sameNameDate == true){
          this.DialogSerivce.openDialog({
            title: "Duplicate Name or Start Date",
            message: 'test',
            confirmText: 'Okay',
            cancelText: 'Cancel',
            oneButton: true,
            DidConfirm: () => {},
          });
        }
    else if(this.newYearCredentials.start_date >= this.newYearCredentials.end_date){
      this.DialogSerivce.openDialog({
        title: "Start date cannot be greater or equal to end date",
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    else{
      this.academicYearService
      .createNewAcademicYearDittofi(this.newYearCredentials, 1)
      .then((res: any) => {
        console.log(res);
        const newAcademicYear = res.data as AcademicYear;
        // this.getAllacademicYears();
        // const acadYear = res.academicYear;
        // this.academicYears.push(acadYear);
        newAcademicYear.edit = false;
        newAcademicYear.cays = [];
        newAcademicYear.start_date = this.formatDate(newAcademicYear.start_date);
        newAcademicYear.end_date = this.formatDate(newAcademicYear.end_date);

        this.academicYears.push(newAcademicYear);
        this.tempAcademicYears = this.academicYears;
        for(let temp of this.tempAcademicYears){
          console.log(temp)
        }
        this.newYearCredentials = new AcademicYear();
        this.cancelYearDialog();

        this.DialogSerivce.openDialog({
          title: "Academic year created successfully",
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

  }

  newYearDialog() {


    const formTable = document.getElementById('newYearTable');
    formTable.style.display = 'block';

  }

  cancelYearDialog() {
    this.newYearCredentials = new AcademicYear();

    const formTable = document.getElementById('newYearTable');
    formTable.style.display = 'none';
  }

  dismissDialog() {
    const modal = document.getElementById('modal');
    modal.classList.remove('is-active');
  }
  deleteYearDialog(year: AcademicYear) {
    const modal = document.getElementById('modal');
    modal.classList.add('is-active');
  }

  expand(year: AcademicYear) {
    // Find DOM node from ID
    const bulmaCollapsibleElement = document.getElementById(
      'collapsible-message-accordion-' + year.id
    )
    if (bulmaCollapsibleElement) {
      // Instanciate bulmaCollapsible component on the node
      // new bulmaCollapsible(bulmaCollapsibleElement);

      if (!year.expand) {
        console.log('entered here: ' + year.expand);
        bulmaCollapsibleElement.style.display = 'block';
        // bulmaCollapsibleElement.bulmaCollapsible('expand');
        year.expand = true;
      }
    }
  }

  collapse(year: AcademicYear) {
    // Find DOM node from ID
    const bulmaCollapsibleElement = document.getElementById(
      'collapsible-message-accordion-' + year.id
    )
    if (bulmaCollapsibleElement) {
      // Instanciate bulmaCollapsible component on the node
      // new bulmaCollapsible(bulmaCollapsibleElement);
      if (year.expand) {
        console.log('entered here: ' + year.expand);
        bulmaCollapsibleElement.style.display = 'none';
        // bulmaCollapsibleElement.bulmaCollapsible('collapse');
        year.expand = false;
      }
    }
  }



  createAcademicClass(academicYear: AcademicYear) {
    console.log(this.selected.length);

    if (this.selected.length > 0) {
      this.academicClassCredentials.cycleId = this.selected[0].cycleId;
    }

    console.log(this.academicClassCredentials)
    this.academicClassService
      .createCAYDittofi(this.academicClassCredentials, academicYear.id)
      .then((res: any) => {
        console.log('hello');
        console.log(res)
        console.log(this.academicClassCredentials);
        if(this.academicYears[this.academicIndex].cays === undefined){
          this.academicYears[this.academicIndex].cays = [];
        }
        this.academicYears[this.academicIndex].cays.push(
          this.academicClassCredentials
        );
        this.tempAcademicYears = this.academicYears;

        this.academicClassCredentials = new AcademicClass();
        const dialog = document.getElementById('addClassForm');
        // dialog.classList.add('is-hidden');
        this.state = "closed"


        this.academicClassCredentials = new AcademicClass();
        this.DialogSerivce.openDialog({
          title: "Academic class was created successfully",
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((res) => {
        console.log(res);

        this.DialogSerivce.openDialog({
          title: res.statusText,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  addClassDialog(index: number) {
    const newIndex = (this.currentPage - 1) * 10 + index;
    window.scroll(0,0);

    const sectionList  = document.getElementById('sectionsList');
    sectionList.classList.add('is-hidden');

    const d = document.getElementById('classRow'+index);
    if(d != null){
      d.classList.remove("highlighted")

    }

    this.academicClassCredentials = new AcademicClass();

    this.editClass = true;
    this.cyclesBool = false;
    this.currentYear = this.academicYears[newIndex];
    this.academicIndex = newIndex;
    const dialog = document.getElementById('addClassForm');
    // dialog.classList.remove('is-hidden');
    this.state = "open"
    dialog.scrollIntoView({ behavior: 'smooth', block: "start" });

  }
  hideClassDialog(){
    const dialog = document.getElementById('addClassForm');
    // dialog.classList.add('is-hidden');
    this.state = "closed"

    const d = document.getElementById('classRow'+this.classNb);
    d.classList.remove("highlighted")
  }

  editAcademicYear(index: number) {
    if(this.newYearCredentials.start_date >= this.newYearCredentials.end_date){
      this.DialogSerivce.openDialog({
        title: "Start date cannot be greater or equal to End date",
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    else{
      this.academicYearService
      .editAcademicYearDittofi(this.newYearCredentials, this.schoolId)
      .then((res) => {
        this.academicYears[index].edit = false;
        this.getAllacademicYears(this.schoolId);
        this.DialogSerivce.openDialog({
          title: 'Academic Year was updated successfully',
          message: 'MESSAGE DIALOG',
          confirmText: 'Ok',
          cancelText: 'Cancel DIALOG',
          oneButton: true,
          DidConfirm: () => {},
        });

      })
      .catch((res) => {
        console.log(res);

        this.DialogSerivce.openDialog({
          title: res,
          message: 'Error',
          confirmText: 'Okay',
          cancelText: '',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
    }

  }
  // tempValue;

  // didClickCancelAcademicYear(i) {
  //   const newIndex = (this.currentPage - 1) * 10 + i;
  //   this.academicYears[newIndex].edit = false;
  //   try {
  //     this.academicYears[newIndex] = JSON.parse(JSON.stringify(this.tempValue));
  //   } catch (err) {}
  // }

  editAcademicYearDialog(index: number) {
    const newIndex = (this.currentPage - 1) * 10 + index;
    console.log(this.academicYears[index]);

    if (this.academicYears[index].edit) {
      console.log('entered');
      this.enablePagination = true

      this.academicYears[index].edit = false;
    } else {
      for (let i = 0; i < this.academicYears.length; i++) {
        this.academicYears[i].edit = false;
      }

      this.enablePagination = false

      this.academicYears[index].edit = true;

      const tempYear = JSON.parse(JSON.stringify(this.academicYears[newIndex]));

      console.log(tempYear.start_date)
      console.log(tempYear.end_date)

      tempYear.start_date =  this.formatDateReverse(tempYear.start_date);
      tempYear.end_date = this.formatDateReverse(tempYear.end_date);
      console.log(tempYear.start_date)
      console.log(tempYear.end_date)
      console.log(tempYear)
      this.newYearCredentials = tempYear;
    }
  }

  formatDate(date: string){
    console.log(date)
    let dateString = date.trim();
    let momentVariable = moment(dateString, 'DD-MM-YYYY');
    let stringvalue = momentVariable.format('YYYY-MM-DD');
    return stringvalue;
  }
  formatDateReverse(date: string){
    console.log(date)
    let dateString = date.trim();
    let momentVariable = moment(dateString, 'YYYY-MM-DD');
    let stringvalue = momentVariable.format('YYYY-MM-DD');
    return stringvalue;
  }
  isActiveYear(index: number, checked: boolean) {
    const newIndex = (this.currentPage - 1) * 10 + index;
    console.log(checked);
    this.academicYearService
      .activateDeactivateAcademicYearDittofi(
        this.academicYears[newIndex].id,
        checked
      )
      .then((res) => {
        this.academicYears[newIndex].is_active = checked;
      })
      .catch((res) => {
        this.academicYears[newIndex].is_active = !checked;
        console.log(res);
        const error = res.error.message;
        this.DialogSerivce.openDialog({
          title: error,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  searchAcademicYear() {
    this.academicYears = this.tempAcademicYears;
    const tempPage = this.currentPage;
    console.log(this.currentPage)
    if (this.yearCode != '') {
      this.currentPage = 1;
      this.academicYears = this.academicYears.filter((res) => {
        return res.code
          .toLocaleLowerCase()
          .match(this.yearCode.toLocaleLowerCase());
      });
    } else if (this.yearCode == '') {
      this.currentPage = tempPage;
    }
    console.log(this.currentPage)
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   console.log(event.previousIndex)
  //   console.log(event.currentIndex)
  //   moveItemInArray(this.academicYears, event.previousIndex, event.currentIndex);
  // }

  dragEnter(event) {
    this.isDragging.next(true);
    console.log(event);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.academicYears,
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

  addSectionForm() {
    const addSection = document.getElementById('addSectionForm');
    const sectionName = document.getElementById(
      'sectionName'
    ) as HTMLInputElement;
    if (addSection.classList.contains('is-hidden')) {
      addSection.classList.remove('is-hidden');
      sectionName.innerHTML = '';
      sectionName.value = '';
    } else {
      addSection.classList.add('is-hidden');
    }
  }

  addCycle() {
    const ngSelect = document.getElementById(
      'ngSelect'
    ) as unknown as NgSelectOption;
    return this.test1 + '(new Cycle)';
  }
  sCycle(term: string, item: AcademicClass) {
    term = term.toLocaleLowerCase();
    return term;
  }

  addTagFn(name) {
    console.log(name);
    return { name: name, tag: true };
  }

  id: number;
  name: string;
  secondName: string;
  code: string;
  cycle: string;
  cycle_id: number;

  addTagPromise = (name) => {
    const c = new Cycle();
    c.name = name;
    c.code = name;

    console.log(this.cycleManagerService.hello);
    this.cycleManagerService
      .createCycleDittofi(1, c)
      .then((res) => {
        console.log(res)
        this.getSchoolCycles();
        this.loading = false;
      })
      .catch((res) => {
        this.loading = false;
        this.DialogSerivce.openDialog({
          title: res.error.message,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  };

  viewClassDetails(i: number, j: number) {
    const newI = (this.currentPage - 1) * 10 + i;

    console.log(newI)
    this.classNb = j;
    this.editClass = false;
    this.cyclesBool = false;
    this.currentAcademicClass = this.academicYears[newI].cays[j];
    const dialog = document.getElementById('addClassForm');
    // dialog.classList.remove('is-hidden');
    this.state = "open"

    const sectionList  = document.getElementById('sectionsList');
    sectionList.classList.remove('is-hidden');
    this.getClassSections(this.currentAcademicClass.id)
    dialog.scrollIntoView({ behavior: 'smooth', block: "start" });

    for(let k =0; k < this.academicYears[newI].cays.length; k++){
      const d = document.getElementById('classRow'+k);
      d.classList.remove("highlighted")
    }
    const finalD = document.getElementById('classRow'+j);
    finalD.classList.add("highlighted");

  }

  //add section api

  createSection() {
    console.log(this.currentAcademicClass.id);
    const sectionFound: Section = this.sections.find(
      ({ code }) => code.toLocaleLowerCase() == this.sectionCredentials.code.toLocaleLowerCase()
    );

    console.log('---------------------------')
    console.log(sectionFound)

    if(sectionFound === undefined){
      this.sectionManagerService
      .createSectionDittofi(
        1,
        this.currentAcademicClass.id,
        this.sectionCredentials
      )
      .then((res : any) => {
        console.log(res);
        this.sections.push(res.data)

        this.sectionCredentials = new Section();
        this.addSectionForm();

        this.DialogSerivce.openDialog({
          title: 'Section was added successfully',
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((res) => {
        this.DialogSerivce.openDialog({
          title: res.error.message,
          message: 'test',
          confirmText: 'Okay',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
    }
    else{
      this.DialogSerivce.openDialog({
        title: 'Section with the same code already exists',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {},
      });
    }

  }

  getSchoolCycles() {
    console.log('cycles get')
    this.cycleManagerService
      .getCyclesDittofi(1)
      .then((res: any) => {
        console.log(res)
        const temp = res.data;

        if(temp != null){
          for (let i = 0; i < temp.length; i++) {
            temp[i].edit = false;
          }
          this.cycles = temp;
          console.log(this.cycles);
        }

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


  viewCycles() {
    this.cyclesBool = true;

    const sectionList  = document.getElementById('sectionsList');
    sectionList.classList.add('is-hidden');
  }

  //delete cycle

  deleteCycle(index: number) {
    console.log(index)
    console.log(this.cycles)
    this.DialogSerivce.openDialog({
      title: 'Are you sure you want to delete this cycle?',
      message: 'test',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      oneButton: false,
      DidConfirm: () => {
        this.cycleManagerService
          .delCycleDittofi(this.cycles[index].id)
          .then((res) => {
            this.cycles.splice(
              this.cycles.findIndex(
                (a) => a.id == this.cycles[index].id
              ),
              1
            );
            console.log(
              'Academic year with name ' +
                this.cycles[index].name +
                ' has been deleted.'
            );
          })
          .catch((res) => {
            console.log(res)
            const error = res.error;
            this.DialogSerivce.openDialog({
              title: error,
              message: 'test',
              confirmText: 'Okay',
              cancelText: 'Cancel',
              oneButton: true,
              DidConfirm: () => {},
            });
          });
      },
    });
  }

  editCycleDialog(index: number) {
    if (this.cycles[index].edit) {
      this.cycleCredentials = new Cycle();
      this.cycles[index].edit = false;
    } else {
      for (let i = 0; i < this.cycles.length; i++) {
        this.cycles[i].edit = false;
      }
      this.cycleCredentials = this.cycles[index];
      this.cycles[index].edit = true;
      this.cycleIndex = index
    }
  }
  //edit cycle
  editCycle() {
    console.log(this.cycleCredentials)
    this.cycles[this.cycleIndex].edit = false
    this.cycleManagerService
      .editCycleDittofi(this.schoolId, this.cycleCredentials)
      .then((res) => {
        console.log(res);
        // this.cycleCredentials = new Cycle();
      });
  }

  expandCollapse(index: number) {
    const newIndex = (this.currentPage - 1) * 10 + index;
    console.log(this.currentPage)
    console.log('pressed: '+ newIndex)
    const arrow = document.getElementById('expandArrow' + index);
    if (this.academicYears[newIndex].expand) {
      arrow.classList.replace('fa-angle-up', 'fa-angle-down');
      this.collapse(this.academicYears[newIndex]);
    } else {
      arrow.classList.replace('fa-angle-down', 'fa-angle-up');

      this.expand(this.academicYears[newIndex]);
    }
  }

  getClassSections(academicClassId: string){
    this.subjectsManagerService
    .getClassSectionsDittofi(1, academicClassId)
    .then((res: any) => {
      console.log(res.data);
      this.sections = res.data;
      for(let i =0 ;i< this.sections.length; i++){
        this.sections[i].id = this.sections[i].Id
      }
    })
    .catch((res) => {
      console.log(res)

    });
  }
  cancelDates(){
    console.log(this.tempAcademicYears)
    this.academicYears = this.tempAcademicYears;
     // Setup default date
     var DefaultDate = new Date();
     // Default is 7 days after today
     DefaultDate.setDate(DefaultDate.getDate() + 7);
     this.dateRange.setValue({ start: null, end: null });
     this.dateRange.updateValueAndValidity();
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
      this.academicYears = this.tempAcademicYears
      this.academicYears = this.academicYears.filter((item: any) => {

        console.log(new Date(item.start_date))
        console.log(endOfTheDay)
        console.log('---------------------------------')
        return (
          new Date(item.start_date) >= toDateStart &&
          new Date(item.end_date) <= endOfTheDay
        );
      }
      );
      this.currentPage = 1;
    } catch (e) {}
  }
}
