import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Class, Curriculum, LearningStandard, Subject, Type, Unit } from 'src/app/modules/Models/curriculum';
import { CurriculumService } from 'src/app/modules/_services/curriculum.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuncsService } from 'src/app/shared/services/funcs.service';
import { Subscription } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CurriculumComponent implements OnInit {

  private customCurriculumSubscription?: Subscription


  classes$ = this._curriculumService.classes$
  subjects$ = this._curriculumService.subjects$
  types$ = this._curriculumService.types$
  learningStandards$ = this._curriculumService.learningStandards$
  defaultCurriculum$ = this._curriculumService.defaultCurriculum$
  customCurriculum$ = this._curriculumService.customCurriculum$
  newCustomCurriculum$ = this._curriculumService.newCustomCurriculum$

  customCurriculum: Curriculum = { defaultConfiguration: false, class: { id: 0, title: '' }, subject: { id: 0, title: '' }, type: { id: 0, title: '' }, units: [] }
  curriculumCurrType!: Type
  defaultConf: boolean = false
  newCustomCurriculumStatus: boolean = false
  action?: string
  parentUnitId: number = 0
  curriculumError?: string
  selectedClass: Class = { id: 0, title: 'Select Class' }
  selectedSubject: Subject = { id: 0, title: 'Select Subject' }
  selectedCurriculumType: Type = { id: 0, title: 'Select Curriculum' }
  learningStandards: LearningStandard[] = []
  relLearningStandards: LearningStandard[] = []
  isUEditing: boolean = false
  isLSEditing: boolean = false
  allSelected: boolean = false
  currEditUnit?: Unit
  defaultView: boolean = true
  currEditLearningStandard?: LearningStandard
  @ViewChild(MatDrawer) matDrawer!: MatDrawer
  @ViewChild('matSections') matSections!: MatSelect
  @ViewChild('appliConf') appliConf!: MatCheckbox

  addUnitForm: FormGroup = this._formBuilder.group({
    code: [null, Validators.required],
    title: [null, Validators.required]
  })

  addLearningStandardForm: FormGroup = this._formBuilder.group({
    code: [null, Validators.required],
    description: [null, Validators.required],
    relatedTo: [null, Validators.required]
  })

  constructor(
    private _breakPointObserver: BreakpointObserver,
    private _curriculumService: CurriculumService,
    private _confirmDialogService: ConfirmDialogService,
    private _formBuilder: FormBuilder,
    private _funcsService: FuncsService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this._breakPointObserver.observe(['(max-width: 768px)']).subscribe((res: any) => {
      if (this.matDrawer) {
        if (res.matches) {
          this.matDrawer.mode = 'over';
        } else {
          this.matDrawer.mode = 'side';
        }
      }
    })

    this.customCurriculumSubscription = this.customCurriculum$?.subscribe((customCurriculum: Curriculum) => this.customCurriculum = customCurriculum)
  }

  ngOnDestroy() {
    this.customCurriculumSubscription?.unsubscribe()
  }

  changeCurriculumView(status: boolean = true) {
    this.defaultView = status
  }

  filter() {
    if (this.selectedClass.id > 0 && this.selectedSubject.id > 0) {
      this._curriculumService.getdefaultCurriculumTypeAndConf(this.selectedClass, this.selectedSubject).subscribe(data => {
        if (data.defaultConf) {
          this.defaultConf = true
          this.defaultView = false
          this.curriculumCurrType = data.type
        } else {
          this.defaultConf = false
          this.defaultView = true
          this.curriculumCurrType = this.selectedCurriculumType
        }

        if (this.curriculumCurrType.id != 0) {
          this._curriculumService.getCurriculum(this.selectedClass, this.selectedSubject, this.curriculumCurrType)
          this._curriculumService.getLearningStandards(this.selectedClass.id, this.selectedSubject.id, this.curriculumCurrType.id)
          this.learningStandards$.subscribe((learningStandards: LearningStandard[]) => this.learningStandards = learningStandards)
          this.newCustomCurriculum$.subscribe((status: boolean) => this.newCustomCurriculumStatus = status)
        }
      })
    }
  }

  applyDefaultConf(event: any) {
    if (event.checked) {
      if (!this.curriculumCurrType) {
        this.curriculumError = 'please choose the curriculum!'
        return
      }
      const options = {
        title: 'Applying Default Configuration',
        message: 'Once you confirm, the curriculum Learning Standards will be copied to the selected subject, and you will not allowed to change the curriculum after that',
        cancelText: 'Cancel',
        confirmText: 'Apply'
      }
      this._confirmDialogService.open(options)
      this._confirmDialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this._curriculumService.applyDefaultConf(this.selectedClass.id, this.selectedSubject.id, this.curriculumCurrType)
          this.defaultConf = true
          this.defaultView = false
        }else{
          this.appliConf.checked = false
        }
      })
    }
  }

  add(action: string, unitId: number = 0) {
    this.allSelected = false
    if (!this.curriculumCurrType) {
      this.curriculumError = 'please choose the curriculum!'
      return
    }
    this.curriculumError = undefined
    this.addUnitForm.reset()
    this.addLearningStandardForm.reset()
    this.action = action
    this.parentUnitId = unitId
    this.matDrawer.open()
  }

  onAddUnit() {
    if (this.addUnitForm.invalid) {
      this._funcsService.markFormGroupTouched(this.addUnitForm)
      return
    }
    this._curriculumService.addUnit(this.defaultConf, this.selectedClass, this.selectedSubject, this.curriculumCurrType, this.addUnitForm.value.code, this.addUnitForm.value.title)

    this.addUnitForm.reset()
    this.matDrawer.close()
  }

  onAddLearningStandard() {
    if (this.addLearningStandardForm.invalid) {
      this._funcsService.markFormGroupTouched(this.addLearningStandardForm)
      return
    }

    this._curriculumService.addLearningStandard(this.defaultConf, this.selectedClass, this.selectedSubject, this.curriculumCurrType, this.parentUnitId, this.addLearningStandardForm.value.code, this.addLearningStandardForm.value.description, this.addLearningStandardForm.value.relatedTo)
    this.addLearningStandardForm.reset()
    this.matDrawer.close()
  }

  editUnit(unit: Unit) {
    this.isUEditing = true
    this.currEditUnit = unit
  }

  editLearningStandard(learningStandard: LearningStandard) {
    this.isLSEditing = true
    this.currEditLearningStandard = learningStandard
  }

  onUnitUpdate(isDefault: boolean, unitId: number) {
    let unitToUpdate: any = document.getElementById(unitId.toString())
    if (!unitToUpdate.value) {
      this.renderer.setStyle(unitToUpdate, "border", "1px solid red")
      return
    }
    let updatedUnitArray: any = unitToUpdate.value.split('. ')
    this._curriculumService.updateUnit(isDefault, unitId, this.selectedClass, this.selectedSubject, this.curriculumCurrType, updatedUnitArray[0], updatedUnitArray[1])
    this.isUEditing = false
  }

  onLsUpdate(isDefault: boolean, lsId: number) {
    let lSToUpdate: any = document.getElementById(lsId.toString())
    if (!lSToUpdate.value) {
      this.renderer.setStyle(lSToUpdate, "border", "1px solid red")
      return
    }
    let updatedLsArray: any = lSToUpdate.value.split('. ')
    this._curriculumService.updateLearningStandard(isDefault, lsId, this.selectedClass, this.selectedSubject, this.curriculumCurrType, updatedLsArray[0], updatedLsArray[1])
    this.isLSEditing = false
  }

  deleteUnit(isDefault: boolean, unitId: number) {
    const options = {
      title: 'Deleting Unit',
      message: 'Are you sure you want to delete this unit?',
      cancelText: 'Cancel',
      confirmText: 'Delete'
    }
    this._confirmDialogService.open(options)
    this._confirmDialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this._curriculumService.deleteUnit(isDefault, unitId, this.selectedClass, this.selectedSubject, this.curriculumCurrType)
      }
    })
  }

  deleteLearningStandard(isDefault: boolean, learningStandardId: number) {
    const options = {
      title: 'Deleting Learning Standard',
      message: 'Are you sure you want to delete this learning standard?',
      cancelText: 'Cancel',
      confirmText: 'Delete'
    }
    this._confirmDialogService.open(options)
    this._confirmDialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this._curriculumService.deleteLearningStandard(isDefault, learningStandardId, this.selectedClass, this.selectedSubject, this.curriculumCurrType)
      }
    })
  }

  toggleAllSelection() {
    this._funcsService.toggleAllSelection(this.allSelected, this.matSections)
  }

  uncheckAllButton() {
    this.allSelected = this._funcsService.uncheckAllButton(this.matSections)
  }
}
