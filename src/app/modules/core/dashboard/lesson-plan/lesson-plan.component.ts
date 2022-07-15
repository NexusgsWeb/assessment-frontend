import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-lesson-plan',
  templateUrl: './lesson-plan.component.html',
  styleUrls: ['./lesson-plan.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LessonPlanComponent implements OnInit {

  @ViewChild('stepper') private stepper: MatStepper | null = null
  step: number = 0
  resetForms: Subject<void> = new Subject<void>()
  newSubtitle: Subject<void> = new Subject<void>()

  toStepTwo: Subject<void> = new Subject<void>()
  toStepThree: Subject<void> = new Subject<void>()
  toStepFour: Subject<void> = new Subject<void>()
  finish: Subject<void> = new Subject<void>()

  formOneValid: boolean = false
  formTwoValid: boolean = false
  formThreeValid: boolean = false
  formFourValid: boolean = false

  stepOneDone: boolean = false
  stepTwoDone: boolean = false
  stepThreeDone: boolean = false
  stepFourDone: boolean = false

  stepperOrientation: Observable<StepperOrientation>

  constructor(
    breakpointObserver: BreakpointObserver,
    private _lessonPlanService: LessonPlanService,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')))
  }

  ngOnInit(): void {
    this._lessonPlanService.getBookChapters()
    this._lessonPlanService.getChapterLessons()

  }

  onStepChange(event: any): void {
    this.step = event.selectedIndex
  }

  nextStep(): void {
    if (this.stepper) {
      if (this.step === 0) {
        this.toStepTwo.next()
        if (this.formOneValid) {
          this.step++
          setTimeout(() => {
            this.stepOneDone = true
            this.stepper?.next()
          }, 100)
        }
      }
      else if (this.step === 1) {
        this.toStepThree.next()
        if (this.formTwoValid) {
          this.step++
          setTimeout(() => {
            this.stepTwoDone = true
            this.stepper?.next()
          }, 100)
        }
      }
      else if (this.step === 2) {
        this.toStepFour.next()
        if (this.formThreeValid) {
          this.step++
          setTimeout(() => {
            this.stepThreeDone = true
            this.stepper?.next()
          }, 100)
        }
      }
      else if (this.step === 3) {
        this.finish.next()
        if (this.formFourValid) {
          // this.step++
          setTimeout(() => {
            this.stepFourDone = true
            // this.stepper?.next()
          }, 100)
        }
      }
    }
  }

  validateFormOne(event: any) {
    this.formOneValid = event
  }

  validateFormTwo(event: any) {
    this.formTwoValid = event
  }

  validateFormThree(event: any) {
    this.formThreeValid = event
  }

  validateFormFour(event: any) {
    this.formFourValid = event
  }

  cancel() {
    if (this.stepper) {
      this.step = 0
      this.stepOneDone = false
      this.stepTwoDone = false
      this.stepThreeDone = false
      this._lessonPlanService.resetForms()
      this.stepper.reset()
    }
  }

  addNewSubtitle(){
    this._lessonPlanService.addNewSubtitle()
  }
}
