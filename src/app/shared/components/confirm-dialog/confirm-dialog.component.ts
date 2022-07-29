import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FuncsService } from '@services/funcs.service';
import { LessonPlanService } from '@services/lesson-plan.service';
import { lessonPlanDurationValidator } from '@validators/lesson-plan-duration.validator';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],

})
export class ConfirmDialogComponent {
  addBookForm: FormGroup = this._formBuilder.group({
    title: ["", Validators.required],
    publisher: ["", Validators.required],
    author: ["", Validators.required],
    edition: [""],
  })

  addChapterForm: FormGroup = this._formBuilder.group({
    title: ["", Validators.required],
    number: ["", Validators.required],
    startPage: ["", Validators.required],
    endPage: ["", Validators.required],
    briefIntroduction: [""],
  })

  addLessonForm: FormGroup = this._formBuilder.group({
    title: ["", Validators.required],
    number: ["", Validators.required],
    startPage: ["", Validators.required],
    endPage: ["", Validators.required],
    briefIntroduction: [""],
  })

  generatePeriodsForm: FormGroup = this._formBuilder.group({
    number: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    duration: ["", [Validators.required, Validators.pattern("^[0-9]*$")]]
  },
    { validators: lessonPlanDurationValidator.durationExceeds(this._lessonPlanService) }
  )

  subtitlesTotalDuration: number = 0
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      cancelText: string,
      confirmText: string,
      message: string,
      title: string,
      panelClass: string,
      action: string,
      additionalData: any
    },
    private mdDialogRef: MatDialogRef<ConfirmDialogComponent>,
    private _formBuilder: FormBuilder,
    private _lessonPlanService: LessonPlanService,
    private _funcsService: FuncsService
  ) {
    if (this.data.additionalData && this.data.additionalData.formThree) {
      this.data.additionalData.formThree.subtitles.map((subtitle: any) => this.subtitlesTotalDuration += Number(subtitle.duration))
    }
  }

  public cancel() {
    this.close(false)
  }

  public close(value: any) {
    this.mdDialogRef.close(value)
  }

  public confirm(): any {
    if (this.data.action === 'book') {
      if (this.addBookForm.invalid) {
        this._funcsService.markFormGroupTouched(this.addBookForm)
        return
      }
      const book: any = this.addBookForm.value
      book.id = Date.now() + Math.floor(Math.random() * 100)
      this._lessonPlanService.addBook(book)
    }

    if (this.data.action === 'chapter') {
      if (this.addChapterForm.invalid) {
        this._funcsService.markFormGroupTouched(this.addChapterForm)
        return
      }
      const chapter: any = this.addChapterForm.value
      chapter.id = Date.now() + Math.floor(Math.random() * 100)
      chapter.bookId = this.data.additionalData.bookId
      this._lessonPlanService.addChapter(chapter)
    }

    if (this.data.action === 'lesson') {
      if (this.addLessonForm.invalid) {
        this._funcsService.markFormGroupTouched(this.addLessonForm)
        return
      }
      const lesson: any = this.addLessonForm.value
      lesson.id = Date.now() + Math.floor(Math.random() * 100)
      lesson.chapterId = this.data.additionalData.chapterId
      this._lessonPlanService.addLesson(lesson)
    }

    if (this.data.action === 'period') {
      if (this.generatePeriodsForm.invalid) {
        this._funcsService.markFormGroupTouched(this.generatePeriodsForm)
        return
      }
      this._lessonPlanService.addLessonPlanPerPeriod(this.generatePeriodsForm.value, this.data.additionalData)
    }




    this.close(true)
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false)
  }
}
