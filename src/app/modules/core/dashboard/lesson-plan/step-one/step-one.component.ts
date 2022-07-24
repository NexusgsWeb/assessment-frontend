import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { Class } from 'src/app/modules/models/curriculum';
import { Book, Chapter, Section } from 'src/app//modules/models/lesson-plan';
import { CurriculumService } from 'src/app/modules/_services/curriculum.service';
import { FuncsService } from 'src/app/modules/_services/funcs.service';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StepOneComponent implements OnInit {
  resetForms$ = this._lessonPlanService.resetForms$
  classes$ = this._curriculumService.classes$
  sections$ = this._curriculumService.sections$
  subjects$ = this._curriculumService.subjects$
  books$ = this._lessonPlanService.books$
  chapters$ = this._lessonPlanService.chapters$
  lessons$ = this._lessonPlanService.lessons$

  private toStepTwoSubscription?: Subscription
  private resetFormSubscription?: Subscription
  private classesSubscription?: Subscription
  private sectionsSubscription?: Subscription

  @Input() toStepTwo?: Observable<void>
  @Output() validFormOne = new EventEmitter<boolean>()
  @ViewChild('matSections') matSections!: MatSelect

  allSelected: boolean = false
  today: string = new Date().toISOString().split('T')[0]
  currBookId?: number
  currChapterId?: number
  classes: Class[] = []
  sections: Section[] = []
  classSections: Section[] = []
  firstFormGroup: FormGroup = this._formBuilder.group({
    id: Date.now()+ Math.floor(Math.random() * 100),
    reference: ["", Validators.required],
    class: ["", Validators.required],
    section: ["", Validators.required],
    subject: ["", Validators.required],
    duration: ["", Validators.pattern(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/)],
    startDate: ["", Validators.required],
    endDate: ["", Validators.required],
    book: ["", Validators.required],
    chapter: ["", Validators.required],
    lesson: ["", Validators.required],
  })

  constructor(
    private _formBuilder: FormBuilder,
    private _confirmDialogService: ConfirmDialogService,
    private _curriculumService: CurriculumService,
    private _lessonPlanService: LessonPlanService,
    private _funcsService: FuncsService
  ) { }

  ngOnInit(): void {
    this.toStepTwoSubscription = this.toStepTwo?.subscribe(() => this.nextStep())
    this.resetFormSubscription = this.resetForms$?.subscribe((reset: boolean) => reset ? this.firstFormGroup.reset() : null)
    this.classesSubscription = this.classes$?.subscribe((classes: Class[]) => this.classes = classes)
    this.sectionsSubscription = this.sections$?.subscribe((sections: Section[]) => this.sections = sections)

    this.firstFormGroup.valueChanges.subscribe(() => {
      this.matSections.close()
    })
  }

  ngOnDestroy(): void {
    this.toStepTwoSubscription?.unsubscribe()
    this.resetFormSubscription?.unsubscribe()
    this.classesSubscription?.unsubscribe()
    this.sectionsSubscription?.unsubscribe()
  }

  getClassSections(event: any) {
    this.classSections = this.sections.filter((section: Section) => section.classId === event.value.id)
  }

  onBookChange(book: Book) {
    this._lessonPlanService.getBookChapters(book.id)
    this.currBookId = book.id
    this.firstFormGroup.controls['chapter'].setValue("")
  }

  onChapterChange(chapter: Chapter) {
    this._lessonPlanService.getChapterLessons(chapter.id)
    this.currChapterId = chapter.id
    this.firstFormGroup.controls['lesson'].setValue("")
  }

  addBook() {
    const options = {
      title: 'Add New Book',
      message: 'book',
      cancelText: 'Cancel',
      confirmText: 'Save',
      panelClass: 'book',
      action: 'book'
    }
    this._confirmDialogService.open(options)
    this._confirmDialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
      }
    })
  }

  addChapter() {
    if (this.currBookId) {
      const options = {
        title: 'Add New Chapter',
        message: 'chapter',
        cancelText: 'Cancel',
        confirmText: 'Save',
        panelClass: 'chapter',
        action: 'chapter',
        additionalData: { bookId: this.currBookId }
      }
      this._confirmDialogService.open(options)
      this._confirmDialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
        }
      })
    } else {
      this.firstFormGroup.controls['book'].markAsTouched()
    }
  }

  addLesson() {
    if (this.currChapterId) {
      const options = {
        title: 'Add New Lesson',
        message: 'lesson',
        cancelText: 'Cancel',
        confirmText: 'Save',
        panelClass: 'lesson',
        action: 'lesson',
        additionalData: { chapterId: this.currChapterId }
      }
      this._confirmDialogService.open(options)
      this._confirmDialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
        }
      })
    } else {
      this.firstFormGroup.controls['chapter'].markAsTouched()
    }
  }

  nextStep() {
    if (this.firstFormGroup.invalid) {
      this._funcsService.markFormGroupTouched(this.firstFormGroup)
      this.validFormOne.emit(false)
      return
    }
    /** send the form data to the lesson plan behavior subject */
    this._lessonPlanService.buildLessonPlan(this.firstFormGroup, 0)
    this.validFormOne.emit(true)
  }

  toggleAllSelection() {
    this._funcsService.toggleAllSelection(this.allSelected, this.matSections)
  }

  uncheckAllButton() {
    this.allSelected = this._funcsService.uncheckAllButton(this.matSections)
  }

}
