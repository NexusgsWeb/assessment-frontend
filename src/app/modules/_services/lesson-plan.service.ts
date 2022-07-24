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
import { Book, Chapter, Lesson } from '../models/lesson-plan';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LessonPlanService {
  lessonPlan: any = {};
  lessonPlanData: any = [];
  private _lessonPlanPerPeriod$: BehaviorSubject<any> =
    new BehaviorSubject<any>({});
  private _lessonPlan$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _subtitleBeingEditedId$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private _subtitleBeingDeletedId$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private _books$: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);
  private _chapters$: BehaviorSubject<Chapter[]> = new BehaviorSubject<
    Chapter[]
  >([]);
  private _lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>(
    []
  );
  private _resetForms$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _newSubtitle$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _validPreview$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public get lessonPlan$(): Observable<any> {
    return this._lessonPlan$;
  }

  public get lessonPlanPerPeriod$(): Observable<any> {
    return this._lessonPlanPerPeriod$;
  }

  public get subtitleBeingEditedId$(): Observable<number> {
    return this._subtitleBeingEditedId$;
  }

  public get subtitleBeingDeletedId$(): Observable<number> {
    return this._subtitleBeingDeletedId$;
  }

  public get books$(): Observable<Book[]> {
    return this._books$;
  }

  public get chapters$(): Observable<Book[]> {
    return this._chapters$;
  }

  public get lessons$(): Observable<Lesson[]> {
    return this._lessons$;
  }

  public get newSubtitle$(): Observable<boolean> {
    return this._newSubtitle$;
  }

  public get resetForms$(): Observable<boolean> {
    return this._resetForms$;
  }

  public get validPreview$(): Observable<boolean> {
    return this._validPreview$;
  }

  constructor(
    private _http: HttpClient,
    private _storageService: StorageService
  ) {
    this._http
      .get<Book[]>(environment.lessonPlanBackEnd)
      .subscribe((lessonPlanData: any) => {
        this.lessonPlanData = lessonPlanData;
        this._books$.next(this.lessonPlanData.books);
      });
  }

  getBookChapters(bookId?: number): void {
    if (bookId) {
      const chapters: Chapter[] = this.lessonPlanData.chapters.filter(
        (chapter: Chapter) => chapter.bookId == bookId
      );
      this._chapters$.next(chapters);
    } else {
      this._chapters$.next([]);
    }
  }

  getChapterLessons(chapterId?: number): void {
    if (chapterId) {
      const lessons: Lesson[] = this.lessonPlanData.lessons.filter(
        (lesson: Lesson) => lesson.chapterId == chapterId
      );
      this._lessons$.next(lessons);
    } else {
      this._lessons$.next([]);
    }
  }

  addBook(book: Book) {
    this.lessonPlanData.books.push(book);
    this._books$.next(this.lessonPlanData.books);
  }

  addChapter(newChapter: Chapter) {
    this.lessonPlanData.chapters.push(newChapter);
    this._chapters$.next(
      this.lessonPlanData.chapters.filter(
        (chapter: Chapter) => chapter.bookId == newChapter.bookId
      )
    );
  }

  addLesson(newLesson: Lesson) {
    this.lessonPlanData.lessons.push(newLesson);
    this._lessons$.next(
      this.lessonPlanData.lessons.filter(
        (lesson: Lesson) => lesson.chapterId == newLesson.chapterId
      )
    );
  }

  addNewSubtitle() {
    this._newSubtitle$.next(true);
  }

  resetForms() {
    this._resetForms$.next(true);
  }

  resetLessonPlan() {
    this.lessonPlan = {};
    this._lessonPlan$.next(this.lessonPlan);
  }

  validateLessonPreview() {
    this._validPreview$.next(true);
  }

  unValidateLessonPreview() {
    this._validPreview$.next(false);
  }

  getIdSubToEdit(id: number) {
    this._subtitleBeingEditedId$.next(id);
  }

  deleteSubTitle(id: number) {
    let lessonPlan: any = {};
    lessonPlan = this._lessonPlan$.value;
    lessonPlan.formThree.subtitles = lessonPlan.formThree.subtitles.filter(
      (subtitle: any) => subtitle.id !== id
    );
    this._lessonPlan$.next(lessonPlan);
    this._subtitleBeingDeletedId$.next(id);
  }

  buildLessonPlan(form: FormGroup, step: number = 0) {
    if (Object.keys(this.lessonPlan).length === 0) {
      this.lessonPlan.id = Date.now() + Math.floor(Math.random() * 100);
      this.lessonPlan.isPublished = false;
    }
    switch (step) {
      case 0:
        this.lessonPlan.formOne = form.value;
        break;
      case 1:
        this.lessonPlan.formTwo = form.value;
        break;
      case 2:
        this.lessonPlan.formThree = form.value;
        break;
    }
    this._lessonPlan$.next(this.lessonPlan);
    // console.log(this._lessonPlan$.value)
  }

  addLessonPlanPerPeriod(settings: any, summary: any) {
    let periods: any = this.associateSubTitlesPeriods(
      this.generatePeriods(settings, summary),
      summary.formThree.subtitles
    );
    this._lessonPlanPerPeriod$.next(periods);
  }

  private generatePeriods(settings: any, summary: any) {
    let periods: any = { data: [] };
    periods.id = Date.now() + Math.floor(Math.random() * 100);
    periods.info = { ...summary };
    periods.info.isPublished = true;
    delete periods.info.formThree;
    for (let i = 1; i <= settings.number; i++) {
      periods.data.push({
        title: `Period ${i}`,
        duration: settings.duration,
        subtitles: [],
      });
    }
    let currLPStorage: any =
      this._storageService.getItemSession(`my_lessonPlan`);
    if (currLPStorage) {
      const isLPExist: boolean = currLPStorage.some(
        (elem: any) => elem.info.id === summary.id
      );
      if (!isLPExist) {
        currLPStorage.push(periods);
        this._storageService.setItemSession(`my_lessonPlan`, currLPStorage);
      } else {
        currLPStorage = currLPStorage.filter(
          (elem: any) => elem.info.id !== summary.id
        );
        currLPStorage.push(periods);
        this._storageService.setItemSession(`my_lessonPlan`, currLPStorage);
      }
    } else {
      currLPStorage = [];
      currLPStorage.push(periods);
      this._storageService.setItemSession(`my_lessonPlan`, currLPStorage);
    }
    return periods;
  }

  private associateSubTitlesPeriods(periods: any, subtitles: any) {
    subtitles = subtitles.map((subtitle: any) => {
      subtitle.isProcessed = false;
      return subtitle;
    });
    let durationAdded = 0,
      leftForNextPeriod = 0,
      isholding,
      tmpSubtitle: any = {},
      tmpTmpSubtitle: any = {};

    periods.data.map((period: any) => {
      isholding = 0;
      if (tmpSubtitle) {
        if (
          tmpSubtitle.duration > period.duration ||
          tmpSubtitle.duration + isholding > period.duration
        ) {
          durationAdded = Number(period.duration) - isholding;
          leftForNextPeriod =
            Number(tmpSubtitle.duration) - Number(durationAdded);

          tmpTmpSubtitle = { ...tmpSubtitle };
          tmpTmpSubtitle.duration = durationAdded;
          period.subtitles.push(tmpTmpSubtitle);

          tmpTmpSubtitle = { ...tmpSubtitle };
          tmpTmpSubtitle.duration = leftForNextPeriod;
          tmpSubtitle = tmpTmpSubtitle;
        } else if (isholding + tmpSubtitle.duration <= period.duration) {
          isholding += tmpSubtitle.duration;
          period.subtitles.push(tmpSubtitle);
          tmpSubtitle = {};
        }
      }
      if (Object.keys(tmpSubtitle).length === 0) {
        for (let subtitle of subtitles) {
          if (!subtitle.isProcessed && isholding < period.duration) {
            if (
              Number(subtitle.duration) > Number(period.duration) ||
              Number(subtitle.duration) + isholding > Number(period.duration)
            ) {
              durationAdded = Number(period.duration) - isholding;
              leftForNextPeriod =
                Number(subtitle.duration) - Number(durationAdded);

              tmpSubtitle = { ...subtitle };
              tmpSubtitle.duration = durationAdded;
              period.subtitles.push(tmpSubtitle);

              tmpSubtitle = { ...subtitle };
              tmpSubtitle.duration = leftForNextPeriod;

              subtitle.isProcessed = true;
              break;
            } else if (
              Number(subtitle.duration) + isholding <=
              Number(period.duration)
            ) {
              isholding += subtitle.duration;
              period.subtitles.push(subtitle);
              subtitle.isProcessed = true;
              tmpSubtitle = {};
            }
          }
        }
      }
      return period;
    });
    return periods;
  }
}
