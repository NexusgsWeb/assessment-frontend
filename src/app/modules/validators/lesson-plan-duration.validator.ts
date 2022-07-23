import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { LessonPlanService } from '@services/lesson-plan.service';

export class lessonPlanDurationValidator {
  static subtitles: any[] = []

  constructor() {

  }


  static durationExceeds(_lessonPlanService: LessonPlanService): ValidatorFn {
    _lessonPlanService.lessonPlan$?.subscribe((lessonPlan) => {
      Object.keys(lessonPlan).length > 0 && lessonPlan.formThree ? lessonPlanDurationValidator.subtitles = lessonPlan.formThree.subtitles : null
    })
    let subsDuration: number = 0
    this.subtitles.map((subtitle: any) => subsDuration += Number(subtitle.duration))
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.get('number') && control.get('duration')) {
        return (Number(control.get('number')?.value) * Number(control.get('duration')?.value)) < subsDuration ? { durationExceeds: true } : null
      }
      return null
    }
  }
}
