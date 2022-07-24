import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSelect } from '@angular/material/select';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, Subscription } from 'rxjs';
import { LearningStandard, Unit } from 'src/app/modules/Models/Curriculum';
import { BlendedLearningService } from 'src/app/modules/_services/blendedLearningService';
import { CurriculumService } from 'src/app/modules/_services/curriculum.service';
import { FuncsService } from 'src/app/modules/_services/funcs.service';
import { LearningPath } from '@models/learningPath';

@Component({
  selector: 'app-learning-path-steps',
  templateUrl: './learning-path-steps.component.html',
  styleUrls: ['./learning-path-steps.component.css'],
})
export class LearningPathStepsComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    sanitize: false,

    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  learningPath$ = this._blendedLearningService.learningPath$;
  resetForms$ = this._blendedLearningService.resetForms$;
  newLPSteps$ = this._blendedLearningService.newLPSteps$;
  lPStepsBeingDeletedId$ = this._blendedLearningService.lPStepsBeingDeletedId$;

  allDomains: boolean = false;
  allLs: boolean = false;
  allPrereqDomains: boolean = false;
  allPrereqLs: boolean = false;
  units?: Unit[];
  learningStandards?: LearningStandard[];

  private learningPathSubscription?: Subscription;
  private toSaveAndFinishSubscription?: Subscription;
  private newLPStepsSubscription?: Subscription;
  private resetFormSubscription?: Subscription;

  @Input() toSaveAndFinish?: Observable<void>;
  @Output() validStepsForm = new EventEmitter<boolean>();
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  @ViewChild('domains') domains!: MatSelect;
  @ViewChild('ls') ls!: MatSelect;
  @ViewChild('prereqDomains') prereqDomains!: MatSelect;
  @ViewChild('prereqLs') prereqLs!: MatSelect;

  today: string = new Date().toISOString().split('T')[0];

  lPStepsFormGroup: FormGroup = this._formBuilder.group({
    id: Date.now() + Math.floor(Math.random() * 100),
    lPStepsSections: this._formBuilder.array([]),
  });

  selectedIndex: number = 0;
  formControls?: any;
  constructor(
    private _formBuilder: FormBuilder,
    private _funcsService: FuncsService,
    private _blendedLearningService: BlendedLearningService,
    private _curriculumService: CurriculumService
  ) {}

  ngOnInit(): void {
    this.toSaveAndFinishSubscription = this.toSaveAndFinish?.subscribe(() =>
      this.nextStep()
    );
    this.learningPathSubscription = this.learningPath$?.subscribe(
      (learningPath: LearningPath) => {
        learningPath ? this.getUnitsAndLs(learningPath) : null;
      }
    );
    this.newLPStepsSubscription = this.newLPSteps$.subscribe(
      (newLPSteps: Boolean) => {
        newLPSteps ? this.addLPStep() : null;
      }
    );
    this.resetFormSubscription = this.resetForms$?.subscribe((reset: boolean) =>
      reset ? this.lPStepsFormGroup.reset() : null
    );
    this.lPStepsSections().clear();
    this.addLPStep();
    this.formControls = (
      this.lPStepsFormGroup.get('lPStepsSections') as FormArray
    ).controls;
    this.lPStepsFormGroup.valueChanges.subscribe(() => {
      this.domains.close();
      this.ls.close();
      this.prereqDomains.close();
      this.prereqLs.close();
    });
  }

  ngOnDestroy(): void {
    this.learningPathSubscription.unsubscribe();
    this.newLPStepsSubscription.unsubscribe();
    this.resetFormSubscription.unsubscribe();
    this.toSaveAndFinishSubscription.unsubscribe();
  }

  lPStepsSections() {
    return this.lPStepsFormGroup.get('lPStepsSections') as FormArray;
  }

  createLPSteps(): FormGroup {
    return this._formBuilder.group({
      id: Date.now() + Math.floor(Math.random() * 100),
      title: [null],
      expectedDuration: this._formBuilder.group({
        duration: [
          null,
          Validators.pattern('/^[+]?([0-9]+(?:[.][0-9]*)?|.[0-9]+)$/'),
        ],
        unitOfTime: ['d'],
      }),
      startDate: [null],
      endDate: [null],
      description: [null],
      domains: [null],
      learningStandards: [null],
      prereqDomains: [null],
      prereqLs: [null],
    });
  }

  addLPStep(): void {
    this.lPStepsSections().push(this.createLPSteps());
    this.selectedIndex = this.lPStepsSections().at(-1).value.id;
  }

  removeLPStep(i: number) {
    this.lPStepsSections().removeAt(i);
  }

  nextStep() {
    console.log(
      'The validity of lpSteps form group is:' + this.lPStepsFormGroup.invalid
    );
    if (this.lPStepsFormGroup.invalid) {
      this._funcsService.markFormGroupTouched(this.lPStepsFormGroup);
      this.validStepsForm.emit(false);
      return;
    }
    /** send the form data to the learning path steps behavior subject */
    this._blendedLearningService.buildLearningPathSteps(
      this.lPStepsFormGroup.value
    );
    this.validStepsForm.emit(true);
  }

  getUnitsAndLs(learningPath: LearningPath) {
    var tempClassId: number;
    var tempSubjectId: number;

    /** TODO this need to be changed, so that interface are either numbers or strings */

    if (learningPath.classId == 'testClass') tempClassId = 1;

    if (learningPath.subjectId == 'testSubject') tempSubjectId = 1;

    this._curriculumService
      .getCustomUnits(tempClassId, tempSubjectId)
      .subscribe((units: Unit[]) => {
        this.units = units;
      });

    this._curriculumService
      .getCustomLearningStandards(tempClassId, tempSubjectId)
      .subscribe((ls: LearningStandard[]) => (this.learningStandards = ls));
  }

  expandLPStep(id: number) {
    this.selectedIndex = id;
  }

  toggleAllSelection(
    checkboxStatus: boolean,
    select: MatSelect | HTMLSelectElement
  ) {
    this._funcsService.toggleAllSelection(checkboxStatus, select);
  }

  uncheckAllButton(type: string, select: MatSelect | HTMLSelectElement) {
    switch (type) {
      case 'domains':
        this.allDomains = this._funcsService.uncheckAllButton(select);
        break;
      case 'learningStandards':
        this.allLs = this._funcsService.uncheckAllButton(select);
        break;
      case 'prereqDomains':
        this.allPrereqDomains = this._funcsService.uncheckAllButton(select);
        break;
      case 'prereqLs':
        this.allPrereqLs = this._funcsService.uncheckAllButton(select);
        break;
    }
  }
}
