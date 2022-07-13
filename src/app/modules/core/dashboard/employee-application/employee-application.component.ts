import { ElementRef, ViewEncapsulation } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ApplicationInitStatus, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as moment from 'moment';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { FormGroup } from '@angular/forms';
import { AddfamilydialogComponent } from '../../../_dialogs/addfamilydialog/addfamilydialog.component';
import { EditfamilydialogComponent } from '../../../_dialogs/editfamilydialog/editfamilydialog.component';
import { StudentManagerService } from 'src/app/modules/_services/student-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { EmployeeManagerService } from 'src/app/modules/_services/employee-manager.service';
import { Employee } from 'src/app/modules/Models/Employee';

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
  selector: 'app-employee-application',
  templateUrl: './employee-application.component.html',
  styleUrls: ['./employee-application.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmployeeApplicationComponent implements OnInit {
  today = new Date();

  @ViewChild('EmployeeToggle') StudentToggle: ElementRef;
  @ViewChild('DepartmentToggle') ClassToggle: ElementRef;
  @ViewChild('DateToggle') DateToggle: ElementRef;
  @ViewChild('EmoloyeeNumberToggle') AppIDToggle: ElementRef;
  @ViewChild('FilterFormField') FilterFormField: MatSelect;

  dateRange = this._formBuilder.group({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });

  p: number = 1;
  PerPage = 5;

  StartIndex: any = 1;
  EndIndex: any = 0;

  filterControl = new UntypedFormControl();
  filterList: string[] = [];

  selectedClass;

  ApplicantListSorted: any;
  ApplicantList: any = [];
  tempListSorted: any = [];
  tempSelectedDeps: string[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private studentmanager: StudentManagerService,
    private schoolmanager: SchoolManagerService,
    private employeeManager: EmployeeManagerService,
    private DialogSerivce: DialogServiceService
  ) {}
  async ngOnInit(): Promise<void> {
    try {
      this.ApplicantList = await this.employeeManager.GetAllEmployeesDittofi(
        this.schoolmanager.getCurrentSchoolID()
      );
    } catch (err) {
      this.DialogSerivce.openDialog({
        title:
          'There was an error Loading your Students.. Please reauthenticate and check.',
        message: 'MESSAGE DIALOG',
        confirmText: 'Ok',
        cancelText: 'Cancel DIALOG',
        oneButton: true,
        DidConfirm: () => {},
      });
    }
    console.log(this.ApplicantList)
    this.ApplicantList = this.ApplicantList.data;
    console.log(this.ApplicantList);
    //Additional validation for incoming dates.
    this.ApplicantList.forEach((element, i) => {
      if (element.first_name === null) {
        this.ApplicantList[i].first_name = 'Not Found';
      }
      if (element.last_name === null) {
        this.ApplicantList[i].last_name = 'Not Found';
      }
      if (element.join_date === null) {
        this.ApplicantList[i].join_date = '1970-01-01';
      }
      if (element.employee_number === null) {
        this.ApplicantList[i].employee_number = 'Not Found';
      }
      if (element.section === null) {
      }
    });
    this.ApplicantListSorted = this.ApplicantList.slice();
    this.tempListSorted = this.ApplicantListSorted;
    this.showNumber();
    this.filterList = this.generateUniqueDeps();
    // Setup default date
    var DefaultDate = new Date();
    // Default is 7 days after today
    DefaultDate.setDate(DefaultDate.getDate() + 7);
    this.dateRange.setValue({ start: new Date(), end: DefaultDate });
    this.dateRange.updateValueAndValidity();
    console.log(this.dateRange);
  }

  changePage() {
    if (this.p === 1) {
      this.StartIndex = 1;
      this.showNumber();
      return;
    }
    this.StartIndex = (this.p - 1) * this.PerPage + 1;
    this.showNumber();
  }
  sortData(sort: Sort) {
    const data = this.ApplicantListSorted.slice();
    this.ApplicantListSorted = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': {
          if (isAsc) {
            this.DateToggle.nativeElement.classList.remove('fa-caret-down');
            this.DateToggle.nativeElement.classList.add('fa-caret-up');
          } else {
            this.DateToggle.nativeElement.classList.add('fa-caret-down');
            this.DateToggle.nativeElement.classList.remove('fa-caret-up');
          }
          // return this.sortFunction(a, b);
          try {
            return this.compare(a.joinDate, b.joinDate, isAsc);
          } catch (err) {
            return 0;
          }
        }
        case 'EmployeeName': {
          if (isAsc) {
            this.StudentToggle.nativeElement.classList.remove('fa-caret-down');
            this.StudentToggle.nativeElement.classList.add('fa-caret-up');
          } else {
            this.StudentToggle.nativeElement.classList.add('fa-caret-down');
            this.StudentToggle.nativeElement.classList.remove('fa-caret-up');
          }
          try {
            return this.compare(a.user.firstName, b.user.firstName, isAsc);
          } catch (err) {
            return 0;
          }
        }
        default:
          return 0;
      }
    });
  }
  compare(
    a: number | string | Date,
    b: number | string | Date,
    isAsc: boolean
  ) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  showNumber() {
    //Check if a filter is already inplace
    if (this.ApplicantListSorted != undefined) {
      if (this.PerPage > this.ApplicantListSorted.length) {
        this.EndIndex = this.ApplicantListSorted.length;
        return;
      }
    }
    if (this.PerPage > this.ApplicantList.length) {
      this.EndIndex = this.ApplicantList.length;
      return;
    }
    this.EndIndex = this.StartIndex + (this.PerPage - 1);
  }

  generateUniqueDeps() {
    const allDeps = [];
    console.log('departments')
    console.log(this.ApplicantListSorted)
    this.ApplicantListSorted.forEach((item) => {
        let dep = {id: item.dep_id, name: item.dep_name}
        allDeps.push(dep);
    });
    console.log(allDeps);
    const unique = [...new Set(allDeps.map((item) => item.name))];
    const resultArr = [];
    resultArr[0] = 'All';
    for (var i of unique) {
      resultArr.push(i);
    }
    this.filterControl.setValue(['All']);
    this.filterControl.updateValueAndValidity();
    console.log(this.filterControl);

    resultArr.sort();
    return resultArr;
  }

  getDepartmentNames(employee: any) {
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

  FilterByDeps(grade: string[], event) {

    console.log(event);
    console.log(this.ApplicantListSorted.length)
    console.log(this.tempListSorted.length)

    if(this.tempSelectedDeps.length == 0 || this.tempSelectedDeps.includes('All') && !grade.includes('All')){
      if(this.ApplicantListSorted.length == this.tempListSorted.length){
        if(grade.length > 1 && grade.includes('All')){
          const ind = grade.indexOf('All')
          grade.splice(ind, 1)
          console.log(this.selectedClass)
        }
      }
    }
    else if(!this.tempSelectedDeps.includes('All') && grade.includes('All')){
      grade.splice(0);
      grade.push('All')
    }



    this.tempSelectedDeps = grade;

    console.log(this.filterControl);
    let resultArr = [];
    this.p = 1;
    console.log(grade);
    if (grade.includes('All') || grade.length === 0) {
      resultArr = this.ApplicantList;
      this.ApplicantListSorted = resultArr;
      console.log(resultArr);
      this.changePage();
      return;
    }
    if (this.ApplicantListSorted.length >= 1) {
      for (let i = 0; i < this.ApplicantList.length; i++) {
          if (grade.includes(this.ApplicantList[i].dep_name)) {
            if (!resultArr.includes(this.ApplicantList[i])) {
              resultArr.push(this.ApplicantList[i]);
            }
          }

      }
      this.ApplicantListSorted = resultArr;
      this.changePage();
    } else {
      for (let i = 0; i < this.ApplicantList.length; i++) {
        resultArr.push(this.ApplicantList[i]);
      }
    }
  }
  didClickFilterByButton() {
    this.FilterFormField.open();
  }

  removeDuplicates(array, key) {
    let lookup = {};
    array.forEach((element) => {
      lookup[element[key]] = element;
    });
    return Object.keys(lookup).map((key) => lookup[key]);
  }

  FilterByDate() {
    let startDate = this.dateRange.value.start;
    let endDate = this.dateRange.value.end;
    let toDateStart = new Date(startDate);
    let toDateEnd = new Date(endDate);
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
      this.ApplicantListSorted = this.ApplicantList.filter((item: any) => {
        return (
          new Date(item.joinDate) >= toDateStart &&
          new Date(item.joinDate) <= toDateEnd
        );
      });
      this.p = 1;
    } catch (e) {}
  }
  cancelDates(){
    this.ApplicantListSorted = this.tempListSorted;
     // Setup default date
     var DefaultDate = new Date();
     // Default is 7 days after today
     DefaultDate.setDate(DefaultDate.getDate() + 7);
     this.dateRange.setValue({ start: null, end: null });
     this.dateRange.updateValueAndValidity();
  }
}
