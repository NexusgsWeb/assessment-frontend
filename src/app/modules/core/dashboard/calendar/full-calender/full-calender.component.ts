import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChildren, ViewChild } from '@angular/core';
// import { Calendar, CalendarOptions,FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-full-calender',
  templateUrl: './full-calender.component.html',
  styleUrls: ['full-calender.component.css']
})
export class AppFullCalenderComponent implements OnChanges, OnInit {

  @Input() goToDate = new Date();
  @Input() filterBy = "";
  eventFiltered = [{}];

  // @ViewChild('fullCalendar') 
  // calendar: FullCalendarComponent;
  // @ViewChild("fullCalendar")
  // calendar: FullCalendarComponent;

  constructor() { }

  ngOnInit(): void {
    // this.calendarOptions.initialDate = this.goToDate;
  }
  allEvents = [
    { 
      title: 'Subject 1',
      class: 'Class 1', 
      start: '2021-10-20T09:00:00', 
      end: '2021-10-20T10:00:00' 
    }, { 
      title: 'Subject 2',
      class: 'Class 1',  
      start: '2021-10-21T09:00:00', 
      end: '2021-10-21T10:00:00' 
    }, { 
      title: 'Subject 1',
      class: 'Class 2',  
      start: '2021-10-22T09:00:00', 
      end: '2021-10-22T10:00:00' 
    }
  ]
  ngOnChanges(changes: SimpleChanges) {
    let date = this.goToDate;
    console.log("changes" + date);
    let year = date.getFullYear();
    let month = date.getMonth() + 0;
    let day = date.getDate();
    // if(this.filterBy && this.filterBy!=""){
    // this.eventFiltered = this.allEvents.filter(event => event.title == this.filterBy || event.class == this.filterBy );
    // this.calendarOptions.events = this.eventFiltered;
    // }else{
    //   this.calendarOptions.events = this.allEvents;
    // }
    // this.calendarOptions.editable = true;
    // this.calendarOptions.initialDate = new Date(year, month, day);
    // if(this.calendar) {
    //   this.calendar.getApi().gotoDate(new Date(year, month, day));
    // }
    
  }
  // calendarOptions: CalendarOptions = {
  //   initialView: 'timeGridWeek',
  //   editable: true,
  //   selectable: true,
  //   selectMirror: true,
  //   nowIndicator: true,
  //   headerToolbar: {
  //     start: 'prev today next title'
  //     , end: ''
  //   },
  //   titleFormat: {
  //     month: 'long',
  //     year: 'numeric',
  //     day: 'numeric'
  //   },
  //   allDaySlot: false,
  //   dayHeaderFormat: {
  //     day: '2-digit',
  //     weekday: 'long'
  //   }, 
  //   events: this.allEvents,
  //   initialDate: new Date(),
    
  // };
  filterEventBySubject(subject:any) {
    return this.allEvents.includes(subject)
  }
  filterEventByClasses(classes:any) {
    return this.allEvents.includes(classes)
  }
}
