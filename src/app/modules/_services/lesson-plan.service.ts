/**
 * in most of this service's functions,
 * when using the API these arguments should be removed since the api will return the required data
 * in fact the whole file shoul;d be updated to match the api calls and response
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book, Chapter, Lesson } from 'src/app/modules/Models/lesson-plan';

@Injectable({
  providedIn: 'root'
})

export class LessonPlanService {
  lessonPlan: any = []
  lessonPlanData: any = []
  private _lessonPlan$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  private _books$: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([])
  private _chapters$: BehaviorSubject<Chapter[]> = new BehaviorSubject<Chapter[]>([])
  private _lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([])
  private _resetForms$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private _newSubtitle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public get lessonPlan$(): Observable<Book[]> {
    return this._lessonPlan$
  }

  public get books$(): Observable<Book[]> {
    return this._books$
  }

  public get chapters$(): Observable<Book[]> {
    return this._chapters$
  }

  public get lessons$(): Observable<Lesson[]> {
    return this._lessons$
  }

  public get newSubtitle$(): Observable<boolean> {
    return this._newSubtitle$
  }

  public get resetForms$(): Observable<boolean> {
    return this._resetForms$
  }

  constructor(private _http: HttpClient) {
    this._http.get<Book[]>(environment.lessonPlanBackEnd).subscribe((lessonPlanData: any) => {
      this.lessonPlanData = lessonPlanData
      this._books$.next(this.lessonPlanData.books)
    })
  }

  getBookChapters(bookId?: number): void {
    if (bookId) {
      const chapters: Chapter[] = this.lessonPlanData.chapters.filter((chapter: Chapter) => chapter.bookId == bookId)
      this._chapters$.next(chapters)
    }
    else {
      this._chapters$.next([])
    }
  }

  getChapterLessons(chapterId?: number): void {
    if (chapterId) {
      const lessons: Lesson[] = this.lessonPlanData.lessons.filter((lesson: Lesson) => lesson.chapterId == chapterId)
      this._lessons$.next(lessons)
    }
    else {
      this._lessons$.next([])
    }
  }

  addBook(book: Book) {
    this.lessonPlanData.books.push(book)
    this._books$.next(this.lessonPlanData.books)
  }

  addChapter(newChapter: Chapter) {
    this.lessonPlanData.chapters.push(newChapter)
    this._chapters$.next(this.lessonPlanData.chapters.filter((chapter: Chapter) => chapter.bookId == newChapter.bookId))
  }

  addLesson(newLesson: Lesson) {
    this.lessonPlanData.lessons.push(newLesson)
    this._lessons$.next(this.lessonPlanData.lessons.filter((lesson: Lesson) => lesson.chapterId == newLesson.chapterId))
  }

  addNewSubtitle() {
    this._newSubtitle$.next(true)
  }

  resetForms() {
    this._resetForms$.next(true)
  }

  buildLessonPlan(form: FormGroup){
    this.lessonPlan.push(form.value)
    this._lessonPlan$.next(this.lessonPlan)
  }
}
