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

  @ViewChild('stepper') stepper!: MatStepper
  step: number = 0
  resetForms: Subject<void> = new Subject<void>()
  newSubtitle: Subject<void> = new Subject<void>()
  toStepTwo: Subject<void> = new Subject<void>()
  toStepThree: Subject<void> = new Subject<void>()
  toStepFour: Subject<void> = new Subject<void>()
  toDraft: Subject<void> = new Subject<void>()
  generatePreview: Subject<void> = new Subject<void>()

  formOneValid: boolean = false
  formTwoValid: boolean = false
  formThreeValid: boolean = false
  previewValid: boolean = false
  isDraft: boolean = false
  stepperOrientation: Observable<StepperOrientation>
  constructor(
    breakpointObserver: BreakpointObserver,
    private _lessonPlanService: LessonPlanService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')))
  }

  ngOnInit(): void {
    this._lessonPlanService.resetLessonPlan()
    this._lessonPlanService.getBookChapters()
    this._lessonPlanService.getChapterLessons()
  }

  onStepChange(index: any): void {
    this._lessonPlanService.unValidateLessonPreview()
    if (index === 0) {
      this.stepper.selectedIndex = index
      this.step = index
    } else {
      this.toStepTwo.next()
      this.toStepThree.next()
      this.toStepFour.next()
      switch (index) {
        case 1:
          if (this.formOneValid) {
            this.stepper.selectedIndex = index
            this.step = index
          }
          break;
        case 2:
          if (this.formTwoValid) {
            this.stepper.selectedIndex = index
            this.step = index
          }
          break;
        case 3:
          if (this.formThreeValid) {
            this.stepper.selectedIndex = index
            this.step = index
          }
          break;
        case 4:
          if (this.previewValid) {
            this.stepper.selectedIndex = index
            this.step = index
          }
          break;
      }
    }
  }

  nextStep(): void {
    if (this.stepper) {
      if (this.step === 0) {
        this.toStepTwo.next()
        if (this.formOneValid) {
          this.step++
          setTimeout(() => {
            this.stepper?.next()
          }, 100)
        }
      }
      else if (this.step === 1) {
        this.toStepThree.next()
        if (this.formTwoValid) {
          this.step++
          setTimeout(() => {
            this.stepper?.next()
          }, 100)
        }
      }
      else if (this.step === 2) {
        this.toStepFour.next()
        if (this.formThreeValid) {
          this.step++
          setTimeout(() => {
            this.stepper?.next()
          }, 100)
        }
      }
      else if (this.step === 3) {
        this.generatePreview.next()
        this._lessonPlanService.validPreview$.subscribe((isValid: boolean) =>{
          if (isValid) {
            this.previewValid = isValid
            this.step++
            setTimeout(() => {
              this.stepper?.next()
            }, 100)
          }
        })
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

  validatePreview(event: any) {
    this.previewValid = event
  }

  addNewSubtitle() {
    this._lessonPlanService.addNewSubtitle()
  }

  saveDraft() {
    this.toDraft.next()
  }

  cancel() {
    if (this.stepper) {
      this.step = 0
      this.formOneValid = false
      this.formTwoValid = false
      this.formThreeValid = false
      this._lessonPlanService.resetForms()
      this.stepper.reset()
    }
  }
}
