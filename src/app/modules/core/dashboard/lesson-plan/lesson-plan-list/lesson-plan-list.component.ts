import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { CurriculumService } from '@services/curriculum.service';
import { LessonPlanService } from '@services/lesson-plan.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list',
  templateUrl: './lesson-plan-list.component.html',
  styleUrls: ['./lesson-plan-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LessonPlansListComponent implements OnInit {
  @ViewChild('selectClass') selectClass!: MatSelect
  @ViewChild('selectSubject') selectSubject!: MatSelect
  @ViewChild('selectStatus') selectStatus!: MatSelect

  myLessonPlans$ = this._lessonPlanService.myLessonPlans$
  filterVals: any = {}
  subtitles: any[] = []
  classes$ = this._curriculumService.classes$
  subjects$ = this._curriculumService.subjects$
  statuses: any[] = [{ id: 1, status: 'Pending' }, { id: 2, status: 'Complete' }, { id: 3, status: 'Incomplete' }]
  chosenDate: any = [
    {
    id: Number(moment().format('MYYYY')),
    title: moment(new Date()).format('MMMM, YYYY'),
    currDate: moment()
  }]

  constructor(private _curriculumService: CurriculumService, private _lessonPlanService: LessonPlanService) { }

  ngOnInit(): void {
    this.onSelectChange(null, 'd')
    }

  onSelectChange(event: any, type: string) {
    switch (type) {
      case 'c':
        event.value.length > 0 ? this.filterVals.class = event.value : delete this.filterVals.class
        break
      case 'su':
        event.value.length > 0 ? this.filterVals.subject = event.value : delete this.filterVals.subject
        break
      case 'st':
        event.value.length > 0 ? this.filterVals.status = event.value : delete this.filterVals.status
        break
      case 'd':
        this.filterVals.date = this.chosenDate
        break
    }
    // console.log(this.filterVals)
  }

  onSelectElementRemoved(element: any, select: MatSelect): void {
    select.options.forEach((item: MatOption) => {
      if(element.id === item.value.id)
      item.deselect()
    })
  }

  increaseOneMonth(){
    let newDate: any = moment(this.chosenDate[0].currDate).add(1, 'months')
    this.chosenDate = [{id: Number(moment(new Date(newDate)).format('MYYYY')), title: moment(new Date(newDate)).format('MMMM, YYYY'), currDate: moment(new Date(newDate))}]
    this.onSelectChange(null, 'd')
  }

  decreaseOneMonth(){
    let newDate: any = moment(this.chosenDate[0].currDate).subtract(1, 'months')
    this.chosenDate = [{id: Number(moment(new Date(newDate)).format('MYYYY')), title: moment(new Date(newDate)).format('MMMM, YYYY'), currDate: moment(new Date(newDate))}]
    this.onSelectChange(null, 'd')
  }
}
