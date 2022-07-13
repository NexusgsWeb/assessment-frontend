import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker-inline-calendar',
  templateUrl: './datepicker-inline-calendar.component.html',
  styleUrls: ['./datepicker-inline-calendar.component.css']
})
export class DatepickerInlineCalendarComponent implements OnInit {
  
  @Output() onDaySelect = new EventEmitter<any>();
  selectedDate: any;
  onSelect(event: any){
    console.log(formatDate(event._d, 'yyyy-MM-ddThh:mm:ss', 'en-US'));
    this.selectedDate= formatDate(event._d, 'yyyy-MM-ddThh:mm:ss', 'en-US');
    this.onDaySelect.emit(this.selectedDate);
  }
  constructor() { }
  ngOnInit(): void {
  }

}
