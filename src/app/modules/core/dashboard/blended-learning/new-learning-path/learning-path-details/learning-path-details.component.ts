import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, Subscription } from 'rxjs';
import { Class } from 'src/app/modules/Models/Class';
import { Section } from 'src/app/modules/Models/Section';
import { BlendedLearningService } from 'src/app/modules/_services/blendedLearningService';
import { FuncsService } from 'src/app/modules/_services/funcs.service';
import { LearningPath } from 'src/app/modules/Models/learningPath';

@Component({
  selector: 'app-learning-path-details',
  templateUrl: './learning-path-details.component.html',
  styleUrls: ['./learning-path-details.component.css'],
})
export class LearningPathDetailsComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
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

  learningPath: LearningPath;
  selectedLearningPathId: number = 0;

  selectedLearningPathId$ =
    this._blendedLearningService.selectedLearningPathId$;
  learningPath$ = this._blendedLearningService.learningPath$;
  classes$ = this._blendedLearningService.classes$;
  subjects$ = this._blendedLearningService.subjects$;
  sections$ = this._blendedLearningService.sections$;
  resetForms$ = this._blendedLearningService.resetForms$;

  private selectedLearningPathIdSubscription?: Subscription;
  private learningPathSubscription?: Subscription;
  private classesSubscription?: Subscription;
  private sectionsSubscription?: Subscription;
  private toLearningPathStepsSubscription?: Subscription;
  private classChangeSubscription?: Subscription;
  private resetFormSubscription?: Subscription;

  @Input() toLearningPathSteps?: Observable<void>;
  @Output() validDetailsForm = new EventEmitter<boolean>();

  @ViewChild('matSections') matSections!: MatSelect;

  allSelected: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  classes: Class[] = [];
  sections: Section[] = [];
  lPDetailsFormGroup: FormGroup = this._formBuilder.group({
    title: [''],
    classId: [''],
    section: [''],
    subjectId: [''],
    lessonExpectedDuration: [''],
    startDate: [''],
    endDate: [''],
    description: [''],
  });
  constructor(
    private _formBuilder: FormBuilder,
    private _funcsService: FuncsService,
    private _blendedLearningService: BlendedLearningService
  ) {}

  ngOnInit(): void {
    this.learningPathSubscription = this.learningPath$?.subscribe(
      (learningPath: LearningPath) => {
        if (this.selectedLearningPathId > 0)
          this.lPDetailsFormGroup.patchValue(learningPath);
      }
    );

    this.selectedLearningPathIdSubscription =
      this.selectedLearningPathId$?.subscribe(
        (selectedLearningPathId: number) => {
          if (selectedLearningPathId > 0) {
            this.selectedLearningPathId = selectedLearningPathId;
            this.getLearningPathById(selectedLearningPathId);
          }
        }
      );

    this.learningPathSubscription = this.learningPath$.subscribe(
      (learningPath: LearningPath) => {
        console.log(learningPath);
        console.log(this.selectedLearningPathId);
        if (this.selectedLearningPathId > 0 && learningPath) {
          this.lPDetailsFormGroup.patchValue(learningPath);
        }
      }
    );

    this.toLearningPathStepsSubscription = this.toLearningPathSteps?.subscribe(
      () => this.nextStep()
    );

    this.classesSubscription = this.classes$?.subscribe(
      (classes: Class[]) => (this.classes = classes)
    );

    this.sectionsSubscription = this.sections$?.subscribe(
      (sections: Section[]) => (this.sections = sections)
    );

    this.classChangeSubscription = this.lPDetailsFormGroup
      .get('classId')
      .valueChanges.subscribe((selectedValue) => {
        this.getSections(selectedValue);
      });

    this.resetFormSubscription = this.resetForms$.subscribe(
      (reset: boolean) => {
        reset ? this.lPDetailsFormGroup.reset() : null;
      }
    );
  }

  ngOnDestroy(): void {
    this.toLearningPathStepsSubscription?.unsubscribe();
    this.classesSubscription?.unsubscribe();
    this.classChangeSubscription?.unsubscribe();
    this.sectionsSubscription?.unsubscribe();
    this.selectedLearningPathIdSubscription?.unsubscribe();
    this.resetFormSubscription.unsubscribe();
  }

  getLearningPathById(learningPathId: number) {
    this._blendedLearningService.getLearningPathById(learningPathId);
  }

  getSections(event: any) {
    this._blendedLearningService.getSections(event);
  }

  nextStep() {
    if (this.lPDetailsFormGroup.invalid) {
      this._funcsService.markFormGroupTouched(this.lPDetailsFormGroup);
      this.validDetailsForm.emit(false);
      return;
    }
    /** */

    // var sectionId: string[] = [];

    // this.lPDetailsFormGroup.value.section.forEach((sec) => {
    //   sectionId.push(sec.id);
    // });

    // let learningPathForm: LearningPath = {
    //   title: this.lPDetailsFormGroup.value.title,
    //   classId: this.lPDetailsFormGroup.value.classId,
    //   sectionsId: sectionId,
    //   subjectId: this.lPDetailsFormGroup.value.subjectId,
    //   lessonExpectedDuration:
    //     this.lPDetailsFormGroup.value.lessonExpectedDuration,
    //   startDate: this.lPDetailsFormGroup.value.startDate,
    //   endDate: this.lPDetailsFormGroup.value.endDate,
    //   description: this.lPDetailsFormGroup.value.description,
    // };

    this._blendedLearningService.buildLearningPathDetails(
      this.lPDetailsFormGroup.value
    );
    this.validDetailsForm.emit(true);
  }

  toggleAllSelection() {
    this._funcsService.toggleAllSelection(this.allSelected, this.matSections);
  }

  uncheckAllButton() {
    this.allSelected = this._funcsService.uncheckAllButton(this.matSections);
  }
}
