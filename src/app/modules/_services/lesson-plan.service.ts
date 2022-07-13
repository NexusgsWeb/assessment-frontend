/**
 * in most of this service's functions,
 * im adding the class and subject as paramters to filter the chosen curriculum,
 * when using the API these arguments should be removed since the api will return the required curriculum
 * in fact the whole file shoul;d be updated to match the api calls and response
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Class,
  Curriculum,
  LearningStandard,
  Subject,
  Type,
  Unit,
} from '../Models/lessonPlan';

@Injectable({
  providedIn: 'root',
})
export class CurriculumService {
  baseUrl = 'assets/data/curriculums.json';
  defaultCurriculums: Curriculum[] = [];
  customCurriculums: Curriculum[] = [];
  newCustomCurriculums: Curriculum[] = [];
  private emptyCurriculum: Curriculum = {
    defaultConfiguration: false,
    class: { id: 0, title: '' },
    subject: { id: 0, title: '' },
    type: { id: 0, title: '' },
    units: [],
  };
  private _isDefaultConf$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  private _classes$: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([
    { id: 0, title: '' },
  ]);
  private _subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject<
    Subject[]
  >([{ id: 0, title: '' }]);
  private _types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([
    { id: 0, title: '' },
  ]);
  private _learningStandards$: BehaviorSubject<LearningStandard[]> =
    new BehaviorSubject<LearningStandard[]>([]);
  private _defaultCurriculum$: BehaviorSubject<Curriculum> =
    new BehaviorSubject<Curriculum>(this.emptyCurriculum);
  private _customCurriculum$: BehaviorSubject<Curriculum> =
    new BehaviorSubject<Curriculum>(this.emptyCurriculum);
  private _newCustomCurriculum$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public get isDefaultConf$(): Observable<boolean> {
    return this._isDefaultConf$;
  }
  public get classes$(): Observable<Class[]> {
    return this._classes$;
  }
  public get subjects$(): Observable<Subject[]> {
    return this._subjects$;
  }
  public get types$(): Observable<Type[]> {
    return this._types$;
  }
  public get learningStandards$(): Observable<LearningStandard[]> {
    return this._learningStandards$;
  }
  public get defaultCurriculum$(): Observable<Curriculum> {
    return this._defaultCurriculum$;
  }
  public get customCurriculum$(): Observable<Curriculum> {
    return this._customCurriculum$;
  }
  public get newCustomCurriculum$(): Observable<boolean> {
    return this._newCustomCurriculum$;
  }

  constructor(private _http: HttpClient) {
    this.getCurriculums();
  }

  getCurriculums() {
    this._http.get<Curriculum[]>(this.baseUrl).subscribe((curriculums: any) => {
      this.defaultCurriculums = curriculums.default;
      this.customCurriculums = curriculums.custom;
    });
  }

  getCurriculum(classObj: Class, subject: Subject): any {
    /** TODO get the curriculums(default and custom) from the api instead of the array og objects above **/

    //getting the default curriculum and the custom curriculum
    const defaultCurriculum: Curriculum = this.defaultCurriculums.filter(
      (c: Curriculum) =>
        c.class.id === classObj.id && c.subject.id === subject.id
    )[0];
    if (defaultCurriculum) this._defaultCurriculum$.next(defaultCurriculum);
    else this._defaultCurriculum$.next(this.emptyCurriculum);

    const customCurriculum: Curriculum = this.customCurriculums.filter(
      (c: Curriculum) =>
        c.class.id === classObj.id && c.subject.id === subject.id
    )[0];
    if (defaultCurriculum && defaultCurriculum.defaultConfiguration) {
      this._customCurriculum$.next(customCurriculum);
      this._newCustomCurriculum$.next(false);
    } else {
      //getting the new custom curriculum
      const newCustomCurriculum: Curriculum = this.newCustomCurriculums.filter(
        (c: Curriculum) =>
          c.class.id === classObj.id && c.subject.id === subject.id
      )[0];
      if (newCustomCurriculum) {
        this._customCurriculum$.next(newCustomCurriculum);
        this._newCustomCurriculum$.next(true);
      } else {
        this._newCustomCurriculum$.next(false);
        this._customCurriculum$.next(this.emptyCurriculum);
      }
    }
  }

  getClasses(): void {
    /** TODO get the classes from the api **/
    const classes: Class[] = [
      { id: 1, title: 'Grade One' },
      { id: 2, title: 'Grade Two' },
      { id: 3, title: 'Grade Three' },
      { id: 4, title: 'Grade Four' },
      { id: 5, title: 'Grade Five' },
    ];
    this._classes$.next(classes);
  }

  getSubjects(): void {
    /** TODO get the subjects from the api **/
    const subjects: Subject[] = [
      { id: 1, title: 'Math' },
      { id: 2, title: 'English' },
      { id: 3, title: 'French' },
      { id: 4, title: 'History' },
      { id: 5, title: 'Physics' },
    ];
    this._subjects$.next(subjects);
  }

  getTypes(): void {
    /** TODO get the classes from the api **/
    const types: Type[] = [
      { id: 1, title: 'Lebanese' },
      { id: 2, title: 'French' },
      { id: 3, title: 'American' },
    ];
    this._types$.next(types);
  }

  getLearningStandards(classId: number, subjectId: number): void {
    const curriculum: Curriculum = this.defaultCurriculums.filter(
      (c: Curriculum) => c.class.id === classId && c.subject.id === subjectId
    )[0];
    const learningStandards: LearningStandard[] = [];
    if (curriculum)
      curriculum.units.map((unit: Unit) =>
        unit.learningStandards.map((laerningStandard: LearningStandard) =>
          learningStandards.push(laerningStandard)
        )
      );
    this._learningStandards$.next(learningStandards);
  }

  changeConfiguration(isDefaultConf: boolean): void {
    /** TODO api patch to store the configuration type  **/
    this._isDefaultConf$.next(isDefaultConf);
  }

  applyDefaultConf(
    classId: number,
    subjectId: number,
    type: Type,
    isApplied: boolean
  ): void {
    /** TODO api patch to store the default configuration flag when its applied
     * isApplied is always true
     ***/
    const defaultCurriculum: Curriculum = this.defaultCurriculums.filter(
      (c: Curriculum) => c.class.id === classId && c.subject.id === subjectId
    )[0];
    if (defaultCurriculum) {
      defaultCurriculum.type = type;
      defaultCurriculum.defaultConfiguration = isApplied;
      this._defaultCurriculum$.next(defaultCurriculum);
    }

    const customCurriculum: Curriculum = this.customCurriculums.filter(
      (c: Curriculum) => c.class.id === classId && c.subject.id === subjectId
    )[0];
    if (customCurriculum) {
      customCurriculum.type = type;
      customCurriculum.defaultConfiguration = isApplied;
      this._customCurriculum$.next(customCurriculum);
    }
  }

  addUnit(
    isDefault: boolean,
    classObj: Class,
    subject: Subject,
    type: Type,
    code: string,
    title: string
  ): void {
    /** TODO api post to add a unit **/
    const newCurriculums: Curriculum = this.newCustomCurriculums.filter(
      (c: Curriculum) =>
        c.class.id === classObj.id && c.subject.id === subject.id
    )[0];
    if (!newCurriculums) {
      this.newCustomCurriculums.push({
        defaultConfiguration: false,
        class: { id: classObj.id, title: classObj.title },
        subject: { id: subject.id, title: subject.title },
        type: { id: type.id, title: type.title },
        units: [],
      });
    }
    let curriculum: Curriculum;

    if (isDefault) {
      this._newCustomCurriculum$.next(false);
      curriculum = this.customCurriculums.filter(
        (c: Curriculum) =>
          c.class.id === classObj.id && c.subject.id === subject.id
      )[0];
    } else {
      this._newCustomCurriculum$.next(true);
      curriculum = this.newCustomCurriculums.filter(
        (c: Curriculum) =>
          c.class.id === classObj.id && c.subject.id === subject.id
      )[0];
    }
    curriculum.units.push({
      id: Date.now(),
      code: code,
      title: title,
      learningStandards: [],
    });
    this._customCurriculum$.next(curriculum);
  }

  addLearningStandard(
    isDefault: boolean,
    classObj: Class,
    subject: Subject,
    unitId: number,
    code: string,
    description: string,
    relatedTo: LearningStandard[]
  ) {
    let selectedUnit: Unit;
    let curriculum: Curriculum = this.getDefaultCurriculum(
      isDefault,
      classObj,
      subject
    );
    selectedUnit = curriculum.units.filter(
      (unit: Unit) => unit.id === unitId
    )[0];
    selectedUnit.learningStandards.push({
      id: Date.now() + Math.floor(Math.random() * 100),
      unitId: unitId,
      code: code,
      description: description,
      relatedTo: relatedTo,
    });
    this._customCurriculum$.next(curriculum);
  }

  updateUnit(
    isDefault: boolean,
    id: number,
    classObj: Class,
    subject: Subject,
    newCode: string,
    newTitle: string
  ) {
    let curriculum: Curriculum = this.getDefaultCurriculum(
      isDefault,
      classObj,
      subject
    );
    curriculum.units.map((unit: Unit) => {
      if (unit.id === id) {
        unit.code = newCode;
        unit.title = newTitle;
      }
      return unit;
    });
    this._customCurriculum$.next(curriculum);
  }

  updateLearningStandard(
    isDefault: boolean,
    id: number,
    classObj: Class,
    subject: Subject,
    newCode: string,
    newDescription: string
  ) {
    let curriculum: Curriculum = this.getDefaultCurriculum(
      isDefault,
      classObj,
      subject
    );
    curriculum.units.map((unit: Unit) =>
      unit.learningStandards.map((learningStandard: LearningStandard) => {
        if (learningStandard.id === id) {
          learningStandard.code = newCode;
          learningStandard.description = newDescription;
        }
        return learningStandard;
      })
    );
    this._customCurriculum$.next(curriculum);
  }

  deleteUnit(
    isDefault: boolean,
    id: number,
    classObj: Class,
    subject: Subject
  ) {
    let curriculum: Curriculum = this.getDefaultCurriculum(
      isDefault,
      classObj,
      subject
    );
    curriculum.units = curriculum.units.filter((unit: Unit) => unit.id != id);
    this._customCurriculum$.next(curriculum);
  }

  deleteLearningStandard(
    isDefault: boolean,
    id: number,
    classObj: Class,
    subject: Subject
  ) {
    let curriculum: Curriculum = this.getDefaultCurriculum(
      isDefault,
      classObj,
      subject
    );
    curriculum.units = curriculum.units.map((unit: Unit) => {
      unit.learningStandards = unit.learningStandards.filter(
        (learningStandard: LearningStandard) => learningStandard.id != id
      );
      return unit;
    });
    this._customCurriculum$.next(curriculum);
  }

  getDefaultCurriculum(
    isDefault: boolean,
    classObj: Class,
    subject: Subject
  ): Curriculum {
    let selectedCurriculums: Curriculum[];
    selectedCurriculums = isDefault
      ? this.customCurriculums
      : this.newCustomCurriculums;
    return selectedCurriculums.filter(
      (c: Curriculum) =>
        c.class.id === classObj.id && c.subject.id === subject.id
    )[0];
  }
}
