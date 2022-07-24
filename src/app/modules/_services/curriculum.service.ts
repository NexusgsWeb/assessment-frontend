/**
 * in most of this service's functions,
 * im adding the class and subject as paramters to filter the chosen curriculum,
 * when using the API these arguments should be removed since the api will return the required curriculum
 * in fact the whole file shoul;d be updated to match the api calls and response
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Class, Curriculum, LearningStandard, Subject, Type, Unit } from '../models/curriculum';
import { Section } from '../models/lesson-plan';

@Injectable({
  providedIn: 'root'
})

export class CurriculumService {
  defaultCurriculums: Curriculum[] = []
  customCurriculums: Curriculum[] = []
  newCustomCurriculums: Curriculum[] = []

  private emptyCurriculum: Curriculum = { defaultConfiguration: false, class: { id: 0, title: '' }, subject: { id: 0, title: '' }, type: { id: 0, title: '' }, units: [] }
  private _isDefaultConf$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  private _classes$: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([{ id: 0, title: '' }])
  private _sections$: BehaviorSubject<Section[]> = new BehaviorSubject<Section[]>([])
  private _subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject<Subject[]>([{ id: 0, title: '' }])
  private _types$: BehaviorSubject<Type[]> = new BehaviorSubject<Type[]>([{ id: 0, title: '' }])
  private _learningStandards$: BehaviorSubject<LearningStandard[]> = new BehaviorSubject<LearningStandard[]>([])
  private _defaultCurriculum$: BehaviorSubject<Curriculum> = new BehaviorSubject<Curriculum>(this.emptyCurriculum)
  private _customCurriculum$: BehaviorSubject<Curriculum> = new BehaviorSubject<Curriculum>(this.emptyCurriculum)
  private _newCustomCurriculum$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public get isDefaultConf$(): Observable<boolean> {
    return this._isDefaultConf$
  }


  public get classes$(): Observable<Class[]> {
    return this._classes$
  }

  public get sections$(): Observable<Section[]> {
    return this._sections$
  }

  public get subjects$(): Observable<Subject[]> {
    return this._subjects$
  }

  public get types$(): Observable<Type[]> {
    return this._types$
  }

  public get learningStandards$(): Observable<LearningStandard[]> {
    return this._learningStandards$
  }

  public get defaultCurriculum$(): Observable<Curriculum> {
    return this._defaultCurriculum$
  }

  public get customCurriculum$(): Observable<Curriculum> {
    return this._customCurriculum$
  }

  public get newCustomCurriculum$(): Observable<boolean> {
    return this._newCustomCurriculum$
  }

  constructor(private _http: HttpClient) {
    this.getCurriculums()
  }

  getCurriculums() {
    this._http.get<Curriculum[]>(environment.curriculumBackend).subscribe((curriculums: any) => {
      this.defaultCurriculums = curriculums.default
      this.customCurriculums = curriculums.custom
      this._classes$.next(curriculums.classes)
      this._sections$.next(curriculums.sections)
      this._subjects$.next(curriculums.subjects)
      this._types$.next(curriculums.types)
    })
  }

  getdefaultCurriculumTypeAndConf(classObj: Class, subject: Subject) {
    let customCurr: Curriculum = this.customCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id)[0]
    return customCurr ? of({ defaultConf: customCurr.defaultConfiguration, type: customCurr.type }) : of({ defaultConf: false, type: {} })
  }

  getCurriculum(classObj: Class, subject: Subject, type: Type): any {
    /** TODO get the curriculums(default and custom) from the api instead of the array og objects above **/
    //getting the default curriculum and the custom curriculum
    const defaultCurriculum: Curriculum = this.defaultCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
    if (defaultCurriculum) this._defaultCurriculum$.next(defaultCurriculum); else this._defaultCurriculum$.next(this.emptyCurriculum)

    const customCurriculum: Curriculum = this.customCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
    if (defaultCurriculum && defaultCurriculum.defaultConfiguration) {
      this._customCurriculum$.next(customCurriculum)
      this._newCustomCurriculum$.next(false)
    } else {
      //getting the new custom curriculum
      const newCustomCurriculum: Curriculum = this.newCustomCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
      if (newCustomCurriculum) {
        this._customCurriculum$.next(newCustomCurriculum)
        this._newCustomCurriculum$.next(true)
      }
      else {
        this._newCustomCurriculum$.next(false)
        this._customCurriculum$.next(this.emptyCurriculum)
      }
    }
  }

  getCustomUnits(classId: number, subjectId: number): Observable<Unit[]> {
    /** the data should be gotten from the database,
     * for now its being fetched form the behavior subject without the use of any parameter,
     * since the behavior subject already contains the last curriculum we made base on our last class and subject choosing in the curriculum component
     *
     * with the help of the api we should be able to fetch the units(domains) of the curriculum of the class having the classId parameter and the subjectId parameter)
     * */
    return of(this._customCurriculum$.value.units)
  }

  getCustomLearningStandards(classId: number, subjectId: number): Observable<LearningStandard[]> {
    /** the data should be gotten from the database,
    * for now its being fetched form the behavior subject without the use of any parameter,
    * since the behavior subject already contains the last curriculum we made base on our last class and subject choosing in the curriculum component
    *
    * with the help of the api we should be able to fetch the learning standards of the curriculum of the class having the classId parameter and the subjectId parameter)
    * */
    let learningStandards: LearningStandard[] = []
    this._customCurriculum$.value.units.map((unit: Unit) => unit.learningStandards.map((learningStandard: LearningStandard) => learningStandards.push(learningStandard)))
    return of(learningStandards)
  }

  getUnits(classId: number, subjectId: number) {
    const curriculum: Curriculum = this.defaultCurriculums.filter((c: Curriculum) => c.class.id === classId && c.subject.id === subjectId)[0]
    const units: Unit[] = []
    if (curriculum)
      curriculum.units.map((unit: Unit) => units.push(unit))
    return of(units)

  }

  getLearningStandards(classId: number, subjectId: number, typeId: number | undefined = 0): void {
    let curriculum: Curriculum
    if (typeId > 0) {
      curriculum = this.defaultCurriculums.filter((c: Curriculum) => c.class.id === classId && c.subject.id === subjectId && c.type.id === typeId)[0]
    } else {
      curriculum = this.defaultCurriculums.filter((c: Curriculum) => c.class.id === classId && c.subject.id === subjectId)[0]
    }
    const learningStandards: LearningStandard[] = []
    if (curriculum)
      curriculum.units.map((unit: Unit) => unit.learningStandards.map((learningStandard: LearningStandard) => learningStandards.push(learningStandard)))
    this._learningStandards$.next(learningStandards)
  }

  changeConfiguration(isDefaultConf: boolean): void {
    /** TODO api patch to store the configuration type  **/
    this._isDefaultConf$.next(isDefaultConf)
  }

  applyDefaultConf(classId: number, subjectId: number, type: Type): void {
    /** TODO api patch to store the default configuration flag when its applied
     * isApplied is always true
     ***/
    const defaultCurriculum: Curriculum = this.defaultCurriculums.filter((c: Curriculum) => c.class.id === classId && c.subject.id === subjectId && c.type.id === type.id)[0]
    if (defaultCurriculum) {
      defaultCurriculum.defaultConfiguration = true
      this._defaultCurriculum$.next(defaultCurriculum)
    }

    const customCurriculum: Curriculum = this.customCurriculums.filter((c: Curriculum) => c.class.id === classId && c.subject.id === subjectId && c.type.id === type.id)[0]
    if (customCurriculum) {
      customCurriculum.defaultConfiguration = true
      this._customCurriculum$.next(customCurriculum)
    }
  }

  addUnit(isDefault: boolean, classObj: Class, subject: Subject, type: Type, code: string, title: string): void {
    /** TODO api post to add a unit **/
    const newCurriculums: Curriculum = this.newCustomCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
    if (!newCurriculums) {
      this.newCustomCurriculums.push({
        defaultConfiguration: false,
        class: { id: classObj.id, title: classObj.title },
        subject: { id: subject.id, title: subject.title },
        type: { id: type.id, title: type.title },
        units: [],
      })
    }
    let curriculum: Curriculum
    if (isDefault) {
      this._newCustomCurriculum$.next(false)
      curriculum = this.customCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
    } else {
      this._newCustomCurriculum$.next(true)
      curriculum = this.newCustomCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
    }
    curriculum.units.push({ id: Date.now(), code: code, title: title, learningStandards: [] })
    this._customCurriculum$.next(curriculum)
  }

  addLearningStandard(isDefault: boolean, classObj: Class, subject: Subject, type: Type, unitId: number, code: string, description: string, relatedTo: LearningStandard[]) {
    let selectedUnit: Unit
    let curriculum: Curriculum = this.getDefaultCurriculum(isDefault, classObj, subject, type)
    selectedUnit = curriculum.units.filter((unit: Unit) => unit.id === unitId)[0]
    selectedUnit.learningStandards.push({ id: Date.now() + Math.floor(Math.random() * 100), unitId: unitId, code: code, description: description, relatedTo: relatedTo })
    this._customCurriculum$.next(curriculum)
  }

  updateUnit(isDefault: boolean, id: number, classObj: Class, subject: Subject, type: Type, newCode: string, newTitle: string) {
    let curriculum: Curriculum = this.getDefaultCurriculum(isDefault, classObj, subject, type)
    curriculum.units.map((unit: Unit) => {
      if (unit.id === id) {
        unit.code = newCode
        unit.title = newTitle
      }
      return unit
    })
    this._customCurriculum$.next(curriculum)
  }

  updateLearningStandard(isDefault: boolean, id: number, classObj: Class, subject: Subject, type: Type, newCode: string, newDescription: string) {
    let curriculum: Curriculum = this.getDefaultCurriculum(isDefault, classObj, subject, type)
    curriculum.units.map((unit: Unit) =>
      unit.learningStandards.map((learningStandard: LearningStandard) => {
        if (learningStandard.id === id) {
          learningStandard.code = newCode
          learningStandard.description = newDescription
        }
        return learningStandard
      }))
    this._customCurriculum$.next(curriculum)
  }

  deleteUnit(isDefault: boolean, id: number, classObj: Class, subject: Subject, type: Type) {
    let curriculum: Curriculum = this.getDefaultCurriculum(isDefault, classObj, subject, type)
    curriculum.units = curriculum.units.filter((unit: Unit) => unit.id != id)
    this._customCurriculum$.next(curriculum)
  }

  deleteLearningStandard(isDefault: boolean, id: number, classObj: Class, subject: Subject, type: Type) {
    let curriculum: Curriculum = this.getDefaultCurriculum(isDefault, classObj, subject, type)
    curriculum.units = curriculum.units.map((unit: Unit) => {
      unit.learningStandards = unit.learningStandards.filter((learningStandard: LearningStandard) => learningStandard.id != id)
      return unit
    })
    this._customCurriculum$.next(curriculum)
  }

  getDefaultCurriculum(isDefault: boolean, classObj: Class, subject: Subject, type: Type): Curriculum {
    let selectedCurriculums: Curriculum[]
    selectedCurriculums = isDefault ? this.customCurriculums : this.newCustomCurriculums
    return selectedCurriculums.filter((c: Curriculum) => c.class.id === classObj.id && c.subject.id === subject.id && c.type.id === type.id)[0]
  }
}
