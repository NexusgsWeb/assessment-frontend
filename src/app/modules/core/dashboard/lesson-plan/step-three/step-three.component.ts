import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSelect } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { LearningStandard } from 'src/app/modules/Models/curriculum';
import { CurriculumService } from 'src/app/modules/_services/curriculum.service';
import { FuncsService } from 'src/app/shared/services/funcs.service';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css']
})
export class StepThreeComponent implements OnInit {
  @ViewChild(MatAccordion) accordion?: MatAccordion

  resetForms$ = this._lessonPlanService.resetForms$
  newSubtitle$ = this._lessonPlanService.newSubtitle$
  lessonPlan$ = this._lessonPlanService.lessonPlan$

  private toStepFourSubscription?: Subscription
  private lessonPlanSubscription?: Subscription
  private newSubTitleSubscription?: Subscription
  private resetFormSubscription?: Subscription

  @Input() toStepFour?: Observable<void>
  @Output() validFormThree = new EventEmitter<boolean>()
  @ViewChildren('ls') ls!: QueryList<MatSelect>
  @ViewChildren('checkAll') checkAll!: QueryList<MatCheckbox>

  thirdFormGroup: FormGroup = this._formBuilder.group({
    subtitles: this._formBuilder.array([])
  })

  learningStandards?: LearningStandard[]
  selectedIndex: number = 0
  formControls: any
  constructor(
    private _formBuilder: FormBuilder,
    private _lessonPlanService: LessonPlanService,
    private _curriculumService: CurriculumService,
    private _funcsService: FuncsService
  ) { }


  ngOnInit(): void {
    this.lessonPlanSubscription = this.lessonPlan$?.subscribe((lessonPlan) => lessonPlan.length > 0 ? this.getLearningStandards(lessonPlan) : null)
    this.toStepFourSubscription = this.toStepFour?.subscribe(() => this.nextStep())
    this.newSubTitleSubscription = this.newSubtitle$?.subscribe((newSubtitle: boolean) => newSubtitle ? this.addSubtitle() : null)
    this.resetFormSubscription = this.resetForms$?.subscribe((reset: boolean) => reset ? this.thirdFormGroup.reset() : null)
    this.addSubtitle()
    this.formControls = (this.thirdFormGroup.get('subtitles') as FormArray).controls

  }

  ngOnDestroy(): void {
    this.toStepFourSubscription?.unsubscribe()
    this.lessonPlanSubscription?.unsubscribe()
    this.newSubTitleSubscription?.unsubscribe()
    this.resetFormSubscription?.unsubscribe()
  }

  subtitles() {
    return (this.thirdFormGroup.get('subtitles')) as FormArray
  }

  createSubtitles(): FormGroup {
    return this._formBuilder.group({
      id: Date.now(),
      title: [null, Validators.required],
      duration: [null, Validators.required],
      startPage: [null],
      endPage: [null],
      description: [null],
      instructional_strategy: [null, Validators.required],
      learningStandards: [null, Validators.required],
      resources: this._formBuilder.array([])
    });
  }

  addSubtitle(): void {
    this.subtitles().push(this.createSubtitles())
    this.selectedIndex = this.subtitles().at(-1).value.id
    this.addResource(this.subtitles().controls.length - 1)

  }

  removeSubtitle(i: number) {
    this.subtitles().removeAt(i);
  }

  resources(subtitle: any) {
    return subtitle.controls.resources.controls
  }

  createResource(): FormGroup {
    return this._formBuilder.group({
      file: [null, Validators.required],
      fileData: [null, Validators.required],
      title: ["", Validators.required],
      type: ["", Validators.required],
    });
  }

  addResource(i: number): void {
    const control = (this.thirdFormGroup.get('subtitles') as FormArray).controls[i].get('resources') as FormArray;
    control.push(this.createResource())
  }

  removeResource(i: number, j: number) {
    const control = (this.thirdFormGroup.get('subtitles') as FormArray).controls[i].get('resources') as FormArray;
    control.removeAt(j)
  }

  handleFileInput(i: number, j: number, event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      const forma = ((this.thirdFormGroup.get('subtitles') as FormArray).controls[i].get('resources') as FormArray).controls[j].patchValue({ fileData: file })
    }
  }

  getLearningStandards(lessonPlan: any) {
    this._curriculumService.getCustomLearningStandards(lessonPlan.class, lessonPlan.subject).subscribe((ls: LearningStandard[]) => this.learningStandards = ls)
  }

  nextStep() {
    if (this.thirdFormGroup.invalid) {
      this._funcsService.markFormGroupTouched(this.thirdFormGroup)
      this.validFormThree.emit(false)
      return
    }
    /** send the form data to the lesson plan behavior subject */
    this._lessonPlanService.buildLessonPlan(this.thirdFormGroup)
    this.validFormThree.emit(true)
  }

  toggleAllSelection(event: any, counter: number) {
    if (event.checked) {
      this.ls.toArray()[counter].options.forEach((item: any) => item.select())
    } else {
      this.ls.toArray()[counter].options.forEach((item: any) => item.deselect())
    }
  }

  uncheckAllButton(counter: number) {
    let newStatus = true
    this.ls.toArray()[counter].options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false
      }
    })
    !newStatus ? this.checkAll.toArray()[counter].checked = false : this.checkAll.toArray()[counter].checked = true
  }
}
