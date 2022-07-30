import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LearningPathActivities } from '../Models/LearningPathActivities';

@Injectable({
  providedIn: 'root',
})
export class LearningPathActivitiesService {
  private baseUrl = 'assets/data/LearningPathActivities.json';
  emptyLearningPathActivity: LearningPathActivities[] = [];
  learningPathActivities: LearningPathActivities[] = [];
  private _learningPathActivities$: BehaviorSubject<LearningPathActivities[]> =
    new BehaviorSubject<[]>(null);

  public get learningPathActivities$(): Observable<LearningPathActivities[]> {
    return this._learningPathActivities$;
  }

  constructor(private _http: HttpClient) {
    this.getAllLearningPathActivities();
  }

  getAllLearningPathActivities() {
    this._http
      .get<LearningPathActivities[]>(this.baseUrl)
      .subscribe((learningPathActivities: LearningPathActivities[]) => {
        this.learningPathActivities = learningPathActivities;
      });
  }

  getLearningPathActivities(
    learningPathStepsId: number
  ): Observable<LearningPathActivities[]> {
    const learningPathActivity: LearningPathActivities[] =
      this.learningPathActivities.filter(
        (learningPathActivity: LearningPathActivities) =>
          learningPathActivity.learningPathStepsId === learningPathStepsId
      );

    return of(learningPathActivity);

    // if (learningPathActivity) {
    //   this._learningPathActivities$.next(learningPathActivity);
    // } else {
    //   this._learningPathActivities$.next(this.emptyLearningPathActivity);
    // }
  }

  addNewLearningPathActivity(learningPathActivity) {
    this._learningPathActivities$.next(learningPathActivity);
  }
}
