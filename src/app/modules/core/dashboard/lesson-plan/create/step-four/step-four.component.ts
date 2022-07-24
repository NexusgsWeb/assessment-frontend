import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { LessonPlanService } from '@services/lesson-plan.service';
import { StorageService } from '@services/storage.service';
import { jsPDF } from "jspdf"
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.css']
})
export class StepFourComponent implements OnInit {
  @Input() generatePreview?: Observable<void>
  @Input() toDraft?: Observable<void>
  @Input() toPdf?: Observable<void>
  @Output() goToStep = new EventEmitter<number>()

  hideEdits: boolean = false
  summary: any
  lessonPlan$ = this._lessonPlanService.lessonPlan$
  private lessonPlanSubscription?: Subscription
  private saveDraftSubscription?: Subscription
  private savePdfSubscription?: Subscription
  private generatePreviewSubscription?: Subscription

  constructor
  (private _lessonPlanService: LessonPlanService,
    private _confirmDialogService: ConfirmDialogService,
    private _storageService: StorageService
    ) { }

  ngOnInit(): void {
    this.saveDraftSubscription = this.toDraft?.subscribe(() => this.saveDraft())
    this.savePdfSubscription = this.toPdf?.subscribe(() => this.savePdf())
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
    this.savePdfSubscription?.unsubscribe()
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

  savePdf(){
    const data: any = document.getElementById('toPdf')
    this.hideEdits=true
    setTimeout(() => {
      document.querySelector('meta[name=viewport]')?.setAttribute("content", "width=1400")
      html2canvas(data, { scale: 3 }).then(canvas => {
        const pdf = new jsPDF('p', 'mm', 'a4')
        const contentDataURL = canvas.toDataURL('image/jpeg')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const widthRatio = pageWidth / canvas.width
        const heightRatio = pageHeight / canvas.height
        const ratio = widthRatio > heightRatio ? heightRatio : widthRatio
        const canvasWidth = canvas.width * ratio
        const canvasHeight = canvas.height * ratio
        const marginX = (pageWidth - canvasWidth) / 2
        const marginY = (pageHeight - canvasHeight) / 2
        pdf.addImage(contentDataURL, 'JPEG', marginX, 0, canvasWidth, canvasHeight)
        pdf.save(`title.pdf`)
      }).then( () => {
        document.querySelector('meta[name=viewport]')?.setAttribute("content", "width=device-width")
        this.hideEdits=false
      })
    }, 0)
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
