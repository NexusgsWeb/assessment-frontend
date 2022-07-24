import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { LessonPlanService } from 'src/app/modules/_services/lesson-plan.service';
import { StorageService } from 'src/app/modules/_services/storage.service';

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.css']
})
export class StepFourComponent implements OnInit {
  @Input() generatePreview?: Observable<void>
  @Input() toDraft?: Observable<void>
  @Output() goToStep = new EventEmitter<number>()


  summary: any
  lessonPlan$ = this._lessonPlanService.lessonPlan$
  private lessonPlanSubscription?: Subscription
  private saveDraftSubscription?: Subscription
  private generatePreviewSubscription?: Subscription

  constructor
  (private _lessonPlanService: LessonPlanService,
    private _confirmDialogService: ConfirmDialogService,
    private _storageService: StorageService
    ) { }

  ngOnInit(): void {
    this.saveDraftSubscription = this.toDraft?.subscribe(() => this.saveDraft())
    this.generatePreviewSubscription = this.generatePreview?.subscribe(() => this.generateLessonPlan())

    this.lessonPlanSubscription = this.lessonPlan$?.subscribe((lessonPlan) => {
      if (lessonPlan.formThree) {
        this.summary = lessonPlan
      }
    })
  }

  ngOnDestroy() {
    this.lessonPlanSubscription?.unsubscribe()
    this.saveDraftSubscription?.unsubscribe()
    this.generatePreviewSubscription?.unsubscribe()
  }

  editStep(index: number, subtitleId: number = 0){
    if(subtitleId > 0) this._lessonPlanService.getIdSubToEdit(subtitleId)
    this.goToStep.emit(index)
  }

  deleteSubtitle(id: number){
    this._lessonPlanService.deleteSubTitle(id)
  }

  saveDraft(){
    this._storageService.setItemSession(`lessonPlan_draft_${this.summary.id}`, this.summary)
  }

  generateLessonPlan(){
    const options = {
      title: '',
      message: 'There are no Timetables associated with the subject, please specify the number and the duration of the period per week:',
      cancelText: 'Cancel',
      confirmText: 'Generate',
      panelClass: 'period',
      action: 'period',
      additionalData: this.summary

    }
    this._confirmDialogService.open(options)
    this._confirmDialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this._lessonPlanService.validateLessonPreview()
      }
    })

  }
}
