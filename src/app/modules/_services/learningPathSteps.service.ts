import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, mergeMap, toArray, concatMap, tap } from 'rxjs/operators';
import { LearningPathSteps } from '../Models/LearningPathSteps';
import { LearningPathActivitiesService } from './learningPathActivities.service';

@Injectable({
  providedIn: 'root',
})
export class LearningPathStepsService {
  private baseUrl = 'assets/data/learningPathSteps.json';

  emptyLearningPathSteps: LearningPathSteps[] = [];
  learningPathSteps: LearningPathSteps[] = [];

  private _selectedStepId$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private _selectedActivityId: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  private _learningPathStepsDetails$: BehaviorSubject<any> =
    new BehaviorSubject<any>([]);
  private _learningPathSteps$: BehaviorSubject<LearningPathSteps[]> =
    new BehaviorSubject<LearningPathSteps[]>([]);

  public get selectedStepId$(): Observable<number> {
    return this._selectedStepId$;
  }

  public get selecetedActivityId$(): Observable<number> {
    return this._selectedActivityId;
  }

  public get learningPathStepsDetails$(): Observable<any> {
    return this._learningPathStepsDetails$;
  }

  public get learningPathSteps$(): Observable<LearningPathSteps[]> {
    return this._learningPathSteps$;
  }

  constructor(
    private _learningPathActivitiesService: LearningPathActivitiesService,
    private _http: HttpClient
  ) {
    this.getAllLearningPathSteps();
  }

  getAllLearningPathSteps() {
    this._http
      .get<LearningPathSteps[]>(this.baseUrl)
      .subscribe((learningPathSteps: LearningPathSteps[]) => {
        this.learningPathSteps = learningPathSteps;
      });
  }

  getLearningPathSteps(
    learningPathId: number
  ): Observable<LearningPathSteps[]> {
    const learningPathSteps: LearningPathSteps[] =
      this.learningPathSteps.filter(
        (learningPathStep: LearningPathSteps) =>
          learningPathStep.learningPathId === learningPathId
      );

    return of(learningPathSteps);
  }

  getLearningPathStepsDetails(learningPathId: number) {
    return this.getLearningPathSteps(learningPathId).pipe(
      mergeMap((learningPathSteps) =>
        from(learningPathSteps).pipe(
          concatMap((learningPathStep) =>
            this._learningPathActivitiesService
              .getLearningPathActivities(learningPathStep.id)
              .pipe(
                map((learningPathActivity) => ({
                  ...learningPathStep,
                  activities: learningPathActivity,
                }))
              )
          ),
          toArray(),
          tap((result) => {
            this._learningPathStepsDetails$.next(result);
          })
        )
      )
    );
  }

  adNewLearningPathSteps(learningPathStep) {
    this._learningPathSteps$.next(learningPathStep);
  }
}
