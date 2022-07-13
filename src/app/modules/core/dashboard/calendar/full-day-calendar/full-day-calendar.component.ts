import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
// import { CalendarOptions } from '@fullcalendar/angular';
import { StorageService } from 'src/app/modules/_services/storage-service.service';

@Component({
  selector: 'app-full-day-calendar',
  templateUrl: './full-day-calendar.component.html',
  styleUrls: ['./full-day-calendar.component.css']
})
export class FullDayCalendarComponent implements OnChanges, OnInit {
  @Input() eDate = "";
  @Input() sDate = "";

  @Output() onCalendarSelection = new EventEmitter<any>();

  constructor(private storageService: StorageService) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
      // this.calendarOptions.events = [{
      //   groupId: 'testGroupId',
      //   start: this.sDate,
      //   end: this.eDate,
      //   display: 'inverse-background'
      // }]
    }

    ngOnInit() {
      this.storageService.setItem("sDate", "2021-10-14T10:00:00")
      this.storageService.setItem("eDate", "2021-10-14T10:30:00")
    }

  // calendarOptions: CalendarOptions = {
  //   initialView: 'timeGridDay',
  //   events: [
  //     {
  //       groupId: 'testGroupId',
  //       start: this.sDate,
  //       end: this.eDate,
  //       display: 'inverse-background'
  //     }
  //   ],
  //   headerToolbar: {
  //     start: 'prev today next title'
  //     , end: ''
  //   },
  //   titleFormat: {
  //     month: 'long',
  //     year: 'numeric',
  //     day: 'numeric'
  //   },
  //   slotLabelFormat: [{
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     omitZeroMinute: true,
  //     meridiem: false,
  //     hour12: false,
  //   }],
  //   slotMinTime:'08:00:00',
  //   slotMaxTime:'16:30:00',
  //   eventTimeFormat: { 
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12:false,
  //     meridiem: false,
  // },
  //   allDaySlot: false,
  //   dayHeaderFormat: {
  //     day: '2-digit',
  //     weekday: 'long'
  //   },
  //   selectable: true,
  //   selectMirror:true,
  //   slotDuration: '00:30:00',
  //   nowIndicator: true,
  //   selectAllow:  (selectedInfo: any)=> {
  //     localStorage.setItem("eDate", selectedInfo.endStr);
  //     localStorage.setItem("sDate", selectedInfo.startStr);
  //     this.onCalendarSelection.emit(selectedInfo);
  //     return selectedInfo
      
  //   }
  // };
}
