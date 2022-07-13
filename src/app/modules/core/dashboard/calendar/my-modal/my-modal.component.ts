import { Component, OnInit, Inject, ChangeDetectorRef, SimpleChanges, ViewChild, EventEmitter, Output, Input, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, NgForm, UntypedFormBuilder, UntypedFormControl, FormGroupDirective, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { StorageService } from 'src/app/modules/_services/storage-service.service';

@Component({
  selector: 'app-my-modal',
  templateUrl: 'my-modal.component.html',
  styleUrls: ['./my-modal.component.css']
})

export class MyModalComponent implements OnInit {

  public startDate = new Date();
  emailLoggedIn = 'email@email.com';
  sDate = new Date();
  eDate = new Date();
  sDateString = "";
  eDateString = "";
  fromTime = "";
  toTime = "";
  classes = ["Class one", "Class Two", "Class Three"];
  fromTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  toTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
  classMembers = ["member 1", "member 2", "member 3"];
  departmentMembers = ["member 1", "member 2", "member 3"];
  departments = ["department 1", "department 2", "department 3"];
  subjects = ["subject 1", "subject 2", "subject 3"];
  nameIcon = 'assets/images/calendar/Name.png';
  serverIcon = 'assets/images/calendar/selectServer.png';
  selectClassIcon = 'assets/images/calendar/selectClass.png';
  selectDepartmentIcon = 'assets/images/calendar/selectDepartment.png';
  selectMembersIcon = 'assets/images/calendar/selectMembers.png';
  time = 'assets/images/calendar/time.png';
  recordIcon = 'assets/images/calendar/recordThisMeeting.png';
  notifyIcon = 'assets/images/calendar/notifyMembers.png';
  errorTimeValidity = false;


  constructor(private fb: UntypedFormBuilder, private cd: ChangeDetectorRef, private storagService: StorageService) { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.storagService.watchStorage().subscribe(() => {
      console.log("storage eDate : " + localStorage.getItem("eDate"))
      console.log("storage sDate : " + localStorage.getItem("sDate"))
    })
  }

  newMeetingForm = this.fb.group(
    {
      name: new UntypedFormControl('', Validators.required),
      server: new UntypedFormControl('', Validators.required),
      date: new UntypedFormControl('', Validators.required),
      recordCheck: new UntypedFormControl({ value: false, disabled: false }),
      notifyCheck: new UntypedFormControl({ value: false, disabled: false }),
      classes: new UntypedFormControl(this.classes, Validators.required),
      fromTime: new UntypedFormControl(this.fromTimes, Validators.required),
      toTime: new UntypedFormControl(this.toTimes, Validators.required),
      classMembers: new UntypedFormControl(this.classMembers, Validators.required),
      departments: new UntypedFormControl(this.departments, Validators.required),
      departmentMembers: new UntypedFormControl(this.departmentMembers, Validators.required),
      subjects: new UntypedFormControl(this.subjects, Validators.required),
    }
  )

  newMeetingFormSubmit() {
    if (this.newMeetingForm.valid && !this.newMeetingForm.pending) {
      console.log(this.newMeetingForm);
      let dateValue = this.newMeetingForm.get('date')!.value._d;
      let stringDate = dateValue.toDateString();
      let date = new Date(stringDate.split('\s')[0]);
      let stringDate1 = dateValue.toDateString();
      let date1 = new Date(stringDate1.split('\s')[0]);
      this.sDate = date;
      console.log(this.sDate);
      this.eDate = date1;

      console.log(this.eDate);
      console.log(this.sDate);
    }
  }

  onChangeFromTime(ob: any) {
    let sHour = this.newMeetingForm.get('fromTime')!.value.split(':')[0];
    let sMinute = this.newMeetingForm.get('fromTime')!.value.split(':')[1];
    this.sDate.setHours(sHour);
    this.sDate.setMinutes(sMinute);
    this.sDate.setSeconds(0);
    this.fromTime = ob.value;
    this.checkTimeValidity(this.fromTime, this.toTime);
    this.sDateString = formatDate(this.sDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
  }
  onChangeToTime(ob: any) {
    let eHour = this.newMeetingForm.get('toTime')!.value.split(':')[0];
    let eMinute = this.newMeetingForm.get('toTime')!.value.split(':')[1];
    this.eDate.setHours(eHour);
    this.eDate.setMinutes(eMinute);
    this.eDate.setSeconds(0);
    this.toTime = ob.value;
    this.checkTimeValidity(this.fromTime, this.toTime);
    this.eDateString = formatDate(this.eDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
  }
  checkTimeValidity(fTime: string, tTime: string) {
    let start = fTime.replace(':', '');
    let end = tTime.replace(':', '');

    if (end != '' && start != '' && end < start) {
      this.errorTimeValidity = true;
    } else {
      this.errorTimeValidity = false;
    }
  }
  doOnCalendarSelect(selectDate:any){
    console.log(selectDate);
    let startDateFromCalendar = formatDate(selectDate.startStr, 'HH:mm', 'en-US');
    let endDateFromCalendar = formatDate(selectDate.endStr, 'HH:mm', 'en-US');
    this.newMeetingForm.get('fromTime')?.setValue(startDateFromCalendar);
    this.newMeetingForm.get('toTime')?.setValue(endDateFromCalendar);

  }
}