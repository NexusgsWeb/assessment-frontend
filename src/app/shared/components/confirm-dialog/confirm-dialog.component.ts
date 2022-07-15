import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FuncsService } from '../../services/funcs.service';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],

})
export class ConfirmDialogComponent {
  addBookForm = this._formBuilder.group({
    title: ["", Validators.required],
    publisher: ["", Validators.required],
    author: ["", Validators.required],
    edition: [""],
  })

  addChapterForm = this._formBuilder.group({
    title: ["", Validators.required],
    number: ["", Validators.required],
    startPage: ["", Validators.required],
    endPage: ["", Validators.required],
    briefIntroduction: [""],
  })

  addLessonForm = this._formBuilder.group({
    title: ["", Validators.required],
    number: ["", Validators.required],
    startPage: ["", Validators.required],
    endPage: ["", Validators.required],
    briefIntroduction: [""],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      cancelText: string,
      confirmText: string,
      message: string,
      title: string,
      panelClass: string,
      action: string
      additionalData: any
    },
    private mdDialogRef: MatDialogRef<ConfirmDialogComponent>,
    private _formBuilder: FormBuilder,
    private _lessonPlanService: LessonPlanService,
    private _funcsService: FuncsService
    ) { }

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
      book.id = Date.now()
      this._lessonPlanService.addBook(book)
    }

    if (this.data.action === 'chapter') {
      if (this.addChapterForm.invalid) {
        this._funcsService.markFormGroupTouched(this.addChapterForm)
        return
      }
      const chapter: any = this.addChapterForm.value
      chapter.id = Date.now()
      chapter.bookId = this.data.additionalData.bookId
      this._lessonPlanService.addChapter(chapter)
    }

    if (this.data.action === 'lesson') {
      if (this.addLessonForm.invalid) {
        this._funcsService.markFormGroupTouched(this.addLessonForm)
        return
      }
      const lesson: any = this.addLessonForm.value
      lesson.id = Date.now()
      lesson.chapterId = this.data.additionalData.chapterId
      this._lessonPlanService.addLesson(lesson)
    }




    this.close(true)
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false)
  }
}
