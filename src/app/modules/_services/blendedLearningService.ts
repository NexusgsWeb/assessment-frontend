import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { LearningPath } from '@models/learningPath';
import { Class } from '../Models/Class';
import { Section } from '../Models/Section';
import { Subject } from '../Models/Subject';

/**
 * in most of this service's functions,
 * im adding the class and subject as paramters to filter the chosen curriculum,
 * when using the API these arguments should be removed since the api will return the required curriculum
 * in fact the whole file shoul;d be updated to match the api calls and response
 */
@Injectable({
  providedIn: 'root',
})
export class BlendedLearningService {
  private baseUrl = 'assets/data/learningPaths.json';
  learningPath: LearningPath;
  learningPaths: LearningPath[] = [];
  emptyLearningPath: LearningPath = {
    id: '',
    imgUrl: '',
    title: '',
    lastAcitivty: '0',
    comletedActivities: 0,
    inProgressActivities: 0,
    notStartedActivities: 0,
    classId: '',
    subjectId: '',
    sectionsId: [''],
  };

  private _learningPathSteps$: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private _newLPSteps$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _resetForms$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _lPStepsBeingDeletedId$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private _classes$: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([
    {
      id: '',
      name: '',
      code: '',
      schoolId: '',
      cycleId: '',
      isActive: false,
      createdAt: '',
      updatedAt: '',
    },
  ]);
  private _subjects$: BehaviorSubject<Subject[]> = new BehaviorSubject<
    Subject[]
  >([
    {
      id: '',
      name: '',
      code: '',
      weight: 0,
      sectionName: '',
      sectionId: '',
      expand: false,
      subjectOrder: 0,
      sections: [],
      classId: '',
      edit: false,
      displayName: '',
      curriculumId: '',
      subjectCode: '',
      gradeCode: '',
      curriculum: null,
    },
  ]);
  private _sections$: BehaviorSubject<Section[]> = new BehaviorSubject<
    Section[]
  >([
    {
      id: '',
      code: '',
      classOfAcademicYearId: '',
      schoolId: '',
      maxNumberOfStudents: 0,
      minNumberOfStudents: 0,
      isActive: false,
      createdAt: '',
      updatedAt: '',
      classOfAcademicYear: null,
      school: null,
      displayName: '',
    },
  ]);

  private _learningPath$: BehaviorSubject<LearningPath> =
    new BehaviorSubject<LearningPath>(this.learningPaths[0]);

  public get learningPathSteps$(): Observable<any> {
    return this._learningPathSteps$;
  }

  public get lPStepsBeingDeletedId$(): Observable<number> {
    return this._lPStepsBeingDeletedId$;
  }

  public get newLPSteps$(): Observable<boolean> {
    return this._newLPSteps$;
  }

  public get resetForms$(): Observable<boolean> {
    return this._resetForms$;
  }

  public get classes$(): Observable<Class[]> {
    return this._classes$;
  }

  public get subjects$(): Observable<Subject[]> {
    return this._subjects$;
  }

  public get learningPath$(): Observable<LearningPath> {
    return this._learningPath$;
  }

  public get sections$(): Observable<Section[]> {
    return this._sections$;
  }

  constructor(private _http: HttpClient) {
    this.getLearningPaths();
  }

  getLearningPaths() {
    this._http
      .get<LearningPath[]>(this.baseUrl)
      .subscribe((learningPaths: LearningPath[]) => {
        this.learningPaths = learningPaths;
      });
  }

  getLearningPath(classObj: Class, subject: Subject): any {
    /** TODO get the learningPath() from the api instead of the array of objects above **/

    //getting the learning path
    const learningPath: LearningPath = this.learningPaths.filter(
      (lP: LearningPath) =>
        lP.classId === classObj.id && lP.subjectId === subject.id
    )[0];

    if (learningPath) this._learningPath$.next(learningPath);
    else this._learningPath$.next(this.emptyLearningPath);
  }

  getClasses(): void {
    /** TODO get the classes from the api **/
    const classes: Class[] = [
      {
        id: 'testClass',
        name: 'Grade One',
        code: '',
        schoolId: '',
        cycleId: '',
        isActive: false,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'testClassTwo',
        name: 'Grade Two',
        code: '',
        schoolId: '',
        cycleId: '',
        isActive: false,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'testClassThree',
        name: 'Grade Three',
        code: '',
        schoolId: '',
        cycleId: '',
        isActive: false,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'testClassThree',
        name: 'Grade Four',
        code: '',
        schoolId: '',
        cycleId: '',
        isActive: false,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'testCLassFive',
        name: 'Grade Five',
        code: '',
        schoolId: '',
        cycleId: '',
        isActive: false,
        createdAt: '',
        updatedAt: '',
      },
    ];
    this._classes$.next(classes);
  }

  getSubjects(): void {
    /** TODO get the subjects from the api **/
    const subjects: Subject[] = [
      {
        id: 'testSubject',
        name: 'Math',
        code: '',
        weight: 0,
        sectionName: '',
        sectionId: '',
        expand: false,
        subjectOrder: 0,
        sections: [],
        classId: '',
        edit: false,
        displayName: '',
        curriculumId: '',
        subjectCode: '',
        gradeCode: '',
        curriculum: null,
      },
      {
        id: 'testSubjectTwo',
        name: 'English',
        code: '',
        weight: 0,
        sectionName: '',
        sectionId: '',
        expand: false,
        subjectOrder: 0,
        sections: [],
        classId: '',
        edit: false,
        displayName: '',
        curriculumId: '',
        subjectCode: '',
        gradeCode: '',
        curriculum: null,
      },
      {
        id: 'testSubjectThree',
        name: 'French',
        code: '',
        weight: 0,
        sectionName: '',
        sectionId: '',
        expand: false,
        subjectOrder: 0,
        sections: [],
        classId: '',
        edit: false,
        displayName: '',
        curriculumId: '',
        subjectCode: '',
        gradeCode: '',
        curriculum: null,
      },
      {
        id: 'testSubjectFour',
        name: 'History',
        code: '',
        weight: 0,
        sectionName: '',
        sectionId: '',
        expand: false,
        subjectOrder: 0,
        sections: [],
        classId: '',
        edit: false,
        displayName: '',
        curriculumId: '',
        subjectCode: '',
        gradeCode: '',
        curriculum: null,
      },
      {
        id: 'testSubjectFive',
        name: 'Physics',
        code: '',
        weight: 0,
        sectionName: '',
        sectionId: '',
        expand: false,
        subjectOrder: 0,
        sections: [],
        classId: '',
        edit: false,
        displayName: '',
        curriculumId: '',
        subjectCode: '',
        gradeCode: '',
        curriculum: null,
      },
    ];
    this._subjects$.next(subjects);
  }

  getSections(classId: String): void {
    const sections: Section[] = [
      {
        id: 'sectionId1',
        code: '',
        classOfAcademicYearId: 'testClass',
        schoolId: '',
        maxNumberOfStudents: 0,
        minNumberOfStudents: 0,
        isActive: false,
        createdAt: '',
        updatedAt: '',
        classOfAcademicYear: null,
        school: null,
        displayName: 'testClas A',
      },
      {
        id: 'sectionId2',
        code: '',
        classOfAcademicYearId: 'testClass',
        schoolId: '',
        maxNumberOfStudents: 0,
        minNumberOfStudents: 0,
        isActive: false,
        createdAt: '',
        updatedAt: '',
        classOfAcademicYear: null,
        school: null,
        displayName: 'testClas B',
      },
      {
        id: 'sectionId3',
        code: '',
        classOfAcademicYearId: 'testClasstwo',
        schoolId: '',
        maxNumberOfStudents: 0,
        minNumberOfStudents: 0,
        isActive: false,
        createdAt: '',
        updatedAt: '',
        classOfAcademicYear: null,
        school: null,
        displayName: 'testClas A',
      },
    ];

    const section: Section[] = sections.filter(
      (sectionObj: Section) => sectionObj.classOfAcademicYearId === classId
    );
    this._sections$.next(section);
  }

  addNewLPSteps() {
    this._newLPSteps$.next(true);
  }

  resetForms() {
    this._resetForms$.next(true);
  }

  buildLearningPathDetails(form: LearningPath) {
    this.learningPath = form;

    this._learningPath$.next(this.learningPath);
  }

  buildLearningPathSteps(form: any) {
    this._learningPathSteps$.next(form);
  }
}
