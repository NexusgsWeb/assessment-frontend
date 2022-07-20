import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { Class, LearningStandard, Subject, Unit } from 'src/app/modules/Models/curriculum';
import { CurriculumService } from 'src/app/modules/_services/curriculum.service';
import { FuncsService } from 'src/app/shared/services/funcs.service';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css']
})
export class StepTwoComponent implements OnInit {
  resetForms$ = this._lessonPlanService.resetForms$
  lessonPlan$ = this._lessonPlanService.lessonPlan$
  currClass?: Class
  currSubject?: Subject
  allDomains: boolean = false
  allLs: boolean = false
  allPrereqDomains: boolean = false
  allPrereqLs: boolean = false
  units?: Unit[]
  learningStandards?: LearningStandard[]
  private toStepThreeSubscription?: Subscription
  private resetFormSubscription?: Subscription
  private lessonPlanSubscription?: Subscription

  @Input() toStepThree?: Observable<void>
  @Output() validFormTwo = new EventEmitter<boolean>()
  @ViewChild('domains') domains!: MatSelect
  @ViewChild('ls') ls!: MatSelect
  @ViewChild('prereqDomains') prereqDomains!: MatSelect
  @ViewChild('prereqLs') prereprereqLsqDomains!: MatSelect

  secondFormGroup: FormGroup = this._formBuilder.group({
    domains: ["", Validators.required],
    learningStandards: ["", Validators.required],
    prereqDomains: ["", Validators.required],
    prereqLs: ["", Validators.required],
  });
  constructor(
    private _formBuilder: FormBuilder,
    private _curriculumService: CurriculumService,
    private _lessonPlanService: LessonPlanService,
    private _funcsService: FuncsService
  ) { }

  ngOnInit(): void {
    this.lessonPlanSubscription = this.lessonPlan$?.subscribe((lessonPlan) => lessonPlan.length > 0 ? this.getUnitsAndLs(lessonPlan) : null)
    this.toStepThreeSubscription = this.toStepThree?.subscribe(() => this.nextStep())
    this.resetFormSubscription = this.resetForms$?.subscribe((reset: boolean) => reset ? this.secondFormGroup.reset() : null)
  }

  ngOnDestroy(): void {
    this.toStepThreeSubscription?.unsubscribe()
    this.lessonPlanSubscription?.unsubscribe()
    this.resetFormSubscription?.unsubscribe()
  }

  nextStep() {
    if (this.secondFormGroup.invalid) {
      this._funcsService.markFormGroupTouched(this.secondFormGroup)
      this.validFormTwo.emit(false)
      return
    }
    /** send the form data to the lesson plan behavior subject */
    this._lessonPlanService.buildLessonPlan(this.secondFormGroup)
    this.validFormTwo.emit(true)
  }

  getUnitsAndLs(lessonPlan: any){
    this._curriculumService.getCustomUnits(lessonPlan.class, lessonPlan.subject).subscribe((units: Unit[]) => this.units = units)
    this._curriculumService.getCustomLearningStandards(lessonPlan.class, lessonPlan.subject).subscribe((ls: LearningStandard[]) => this.learningStandards = ls)
  }

  resetForm() {
    this.secondFormGroup.reset()
  }

  toggleAllSelection(checkboxStatus: boolean, select: MatSelect | HTMLSelectElement) {
    this._funcsService.toggleAllSelection(checkboxStatus, select)
  }

  uncheckAllButton(type: string, select: MatSelect | HTMLSelectElement) {
    switch(type){
      case 'domains':
        this.allDomains = this._funcsService.uncheckAllButton(select)
        break
      case 'learningStandards':
        this.allLs = this._funcsService.uncheckAllButton(select)
        break
      case 'prereqDomains':
        this.allPrereqDomains = this._funcsService.uncheckAllButton(select)
        break
      case 'prereqLs':
        this.allPrereqLs = this._funcsService.uncheckAllButton(select)
        break
    }
  }
}
