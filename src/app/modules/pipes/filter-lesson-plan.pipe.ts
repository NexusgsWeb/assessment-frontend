import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'filterSubTitles',
  pure: false
})
export class FilterLessonPlanPipe implements PipeTransform {

  constructor() { }
  transform(array: any[], filterVals: any) {
    if (!filterVals || Object.keys(filterVals).length === 0 || filterVals == undefined) {
      return array
    }
    const keys = Object.keys(filterVals).filter(key => filterVals[key])
    const filterUser = (lessonPlan: any) => keys.every(key =>{
      if(key === 'date'){
        return (filterVals[key].map((item: any) => item.id).includes((Number(moment(new Date(lessonPlan.info.startDate)).format('MYYYY'))))
        || filterVals[key].map((item: any) => item.id).includes((Number(moment(new Date(lessonPlan.info.endDate)).format('MYYYY')))))
      }else{
        return filterVals[key].map((item: any) => item.id).includes(lessonPlan.info[key].id)
      }
    })
    return keys.length ? array.filter(filterUser) : array
  }
}
