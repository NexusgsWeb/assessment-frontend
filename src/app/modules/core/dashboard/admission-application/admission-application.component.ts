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
import { StudentManagerService } from 'src/app/modules/_services/student-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { MatSelect } from '@angular/material/select';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { FlatfileMethods } from '@flatfile/angular';

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
  selector: 'app-admission-application',
  templateUrl: './admission-application.component.html',
  styleUrls: ['./admission-application.component.css'],
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
export class AdmissionApplicationComponent implements OnInit, FlatfileMethods  {
  today = new Date();

  @ViewChild('StudentToggle') StudentToggle: ElementRef;
  @ViewChild('ClassToggle') ClassToggle: ElementRef;
  @ViewChild('DateToggle') DateToggle: ElementRef;
  @ViewChild('AppIDToggle') AppIDToggle: ElementRef;
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

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private studentmanager: StudentManagerService,
    private schoolmanager: SchoolManagerService,
    private DialogSerivce: DialogServiceService
  ) {}
  licenseKey: string;
  customer: import("@flatfile/angular").FlatfileCustomer;
  settings: import("@flatfile/angular").FlatfileSettings;
  onCancel?: () => void;
  onData?: (results: import("@flatfile/angular").FlatfileResults) => Promise<string | void>;
  onRecordChange?: import("@flatfile/angular").RecordInitOrChangeCallback;
  onRecordInit?: import("@flatfile/angular").RecordInitOrChangeCallback;
  fieldHooks?: import("@flatfile/adapter").IDictionary<import("@flatfile/angular").FieldHookCallback>;
  async ngOnInit(): Promise<void> {
    try {
      this.ApplicantList = await this.studentmanager.GetAllStudentsForSchoolDittofi(
        this.schoolmanager.getCurrentSchoolID()
      );
    } catch (err) {
      console.log(err)
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
    //Additional validation for incoming dates.
    this.ApplicantList.forEach((element, i) => {
      if (element.firstName === null) {
        this.ApplicantList[i].user.first_name = 'Not Found';
      }
      if (element.last_name === null) {
        this.ApplicantList[i].user.lastName = 'Not Found';
      }
      if (element.admission_date === null) {
        this.ApplicantList[i].admission_date = '1970-01-01';
      }
      if (element.student_number === null) {
        this.ApplicantList[i].student_number = 'Not Found';
      }
      if (element.section === null) {
        console.log('FOUND A NULL SECTION???');
        console.log(element);
      }
    });
    this.ApplicantListSorted = this.ApplicantList.slice();

    console.log(this.ApplicantListSorted)
    this.showNumber();
    this.filterList = this.generateUniqueClasses();
    // Setup default date
    var DefaultDate = new Date();
    // Default is 7 days after today
    DefaultDate.setDate(DefaultDate.getDate() + 7);
    this.dateRange.setValue({ start: new Date(), end: DefaultDate });
    this.dateRange.updateValueAndValidity();
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
        case 'class': {
          if (isAsc) {
            this.ClassToggle.nativeElement.classList.remove('fa-caret-down');
            this.ClassToggle.nativeElement.classList.add('fa-caret-up');
          } else {
            this.ClassToggle.nativeElement.classList.add('fa-caret-down');
            this.ClassToggle.nativeElement.classList.remove('fa-caret-up');
          }
          try {
            return this.compare(a.section.cay.name, b.section.cay.name, isAsc);
          } catch (err) {
            return 0;
          }
        }
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
            return this.compare(a.admissionDate, b.admissionDate, isAsc);
          } catch (err) {
            return 0;
          }
        }
        case 'studentName': {
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
        case 'admissionNumber': {
          if (isAsc) {
            this.StudentToggle.nativeElement.classList.remove('fa-caret-down');
            this.StudentToggle.nativeElement.classList.add('fa-caret-up');
          } else {
            this.StudentToggle.nativeElement.classList.add('fa-caret-down');
            this.StudentToggle.nativeElement.classList.remove('fa-caret-up');
          }
          try {
            return this.compare(a.studentNumber, b.studentNumber, isAsc);
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

  generateUniqueClasses() {
    console.log(this.ApplicantListSorted)
    try {
      const unique = [
        ...new Set(
          this.ApplicantListSorted.map((item) => item.class_name)
        ),
      ];
      const resultArr = [];
      resultArr[0] = 'All';
      for (var i of unique) {
        resultArr.push(i);
      }
      resultArr.sort();
      return resultArr;
    } catch (err) {
      console.log(
        'There was an error generating unique classes.. unique classes has been disabled for now'
      );
      return [];
    }
  }

  FilterByClass(grade: string[]) {
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
        if (grade.includes(this.ApplicantList[i].class_name)) {
          resultArr.push(this.ApplicantList[i]);
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
          new Date(item.admissionDate) >= toDateStart &&
          new Date(item.admissionDate) <= toDateEnd
        );
      });
      this.p = 1;
    } catch (e) {}
  }

  uploadData(){

  }
}
