import { Component, OnInit, Input } from '@angular/core';
import { MyModalComponent } from './my-modal/my-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarManagerService } from 'src/app/modules/_services/calendar-manager.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Input() goToDate = "";
  name: string | undefined;
  color: string | undefined;
  goToSelectedDate = new Date();
  filter = "";

  constructor(public dialog: MatDialog, private calendarManager: CalendarManagerService) { }
  ngOnInit(): void {
    this.getAvayaAccessToken();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MyModalComponent, {
      width: window.innerWidth + '',
      data: { name: this.name, color: this.color }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.color = res;
    });
  }


  doOnDaySelect(selectedDate:any){
    console.log(selectedDate);
    this.goToSelectedDate = new Date(selectedDate);
  }

  doOnFilterClick(filter:any){
    console.log(filter);
    this.filter = filter;
  }

  getAvayaAccessToken(){
    this.calendarManager.getAvayaAccessToken().then((res) => {
      console.log(res)
    }).catch((res) => {
      console.log(res)
    })
  }
}