import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {
  Class,
  LearningStandard,
  Subject,
  Type,
  Unit,
} from 'src/app/modules/Models/LessonPlan';
import { CurriculumService } from 'src/app/modules/_services/lesson-plan.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatCheckbox } from '@angular/material/checkbox';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/confirm-dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CurriculumComponent implements OnInit {
  isDefaultConf$ = this._curriculumService.isDefaultConf$;
  classes$ = this._curriculumService.classes$;
  subjects$ = this._curriculumService.subjects$;
  types$ = this._curriculumService.types$;
  learningStandards$ = this._curriculumService.learningStandards$;
  defaultCurriculum$ = this._curriculumService.defaultCurriculum$;
  customCurriculum$ = this._curriculumService.customCurriculum$;
  newCustomCurriculum$ = this._curriculumService.newCustomCurriculum$;
  curriculumCurrType!: Type;
  defaultConf: boolean = true;
  defaultApplied: boolean = false;
  newCustomCurriculumStatus: boolean = false;
  action?: string;
  parentUnitId: number = 0;
  curriculumError?: string;
  selectedClass: Class = { id: 0, title: 'Select Class' };
  selectedSubject: Subject = { id: 0, title: 'Select Subject' };
  selectedCurriculumType: Type = { id: 0, title: 'Select Curriculum' };
  learningStandards: LearningStandard[] = [];
  relLearningStandards: LearningStandard[] = [];
  isUEditing: boolean = false;
  isLSEditing: boolean = false;
  currEditUnit?: Unit;
  currEditLearningStandard?: LearningStandard;
  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  @ViewChild(MatCheckbox) applyDefConf!: MatCheckbox;
  @ViewChild('allSelected') private allSelected!: MatOption;

  addUnitForm: FormGroup = this._formBuilder.group({
    code: [null, Validators.required],
    title: [null, Validators.required],
  });

  addLearningStandardForm: FormGroup = this._formBuilder.group({
    code: [null, Validators.required],
    description: [null, Validators.required],
    relatedTo: [null, Validators.required],
  });

  constructor(
    private _breakPointObserver: BreakpointObserver,
    private _curriculumService: CurriculumService,
    private _confirmDialogService: ConfirmDialogService,
    private _formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this._breakPointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((res: any) => {
        if (this.matDrawer) {
          if (res.matches) {
            this.matDrawer.mode = 'over';
          } else {
            this.matDrawer.mode = 'side';
          }
        }
      });

    this.isDefaultConf$.subscribe((status) => (this.defaultConf = status));
  }

  changeToDefault(defaultC: boolean = true) {
    this.defaultConf = defaultC ?? false;
    this._curriculumService.changeConfiguration(this.defaultConf);
  }

  getCurrType(event: any) {
    this.curriculumCurrType = event.value;
  }

  filter() {
    console.log(this.selectedClass);
    if (this.selectedClass.id > 0 && this.selectedSubject.id > 0) {
      this._curriculumService.getCurriculum(
        this.selectedClass,
        this.selectedSubject
      );
      this._curriculumService.getLearningStandards(
        this.selectedClass.id,
        this.selectedSubject.id
      );
      this.learningStandards$.subscribe(
        (learningStandards: LearningStandard[]) =>
          (this.learningStandards = learningStandards)
      );
      this.newCustomCurriculum$.subscribe(
        (status: boolean) => (this.newCustomCurriculumStatus = status)
      );
    }
  }

  applyDefaultConf() {
    if (this.applyDefConf.checked) {
      if (!this.curriculumCurrType) {
        this.applyDefConf.checked = false;
        this.curriculumError = 'please choose the curriculum!';
        return;
      }
      const options = {
        title: 'Applying Default Configuration',
        message:
          'Once you confirm, the curriculum Learning Standards will be copied to the selected subject, and you will not allowed to change the curriculum after that',
        cancelText: 'Cancel',
        confirmText: 'Apply',
      };
      this._confirmDialogService.open(options);
      this._confirmDialogService.confirmed().subscribe((confirmed) => {
        if (confirmed) {
          this._curriculumService.applyDefaultConf(
            this.selectedClass.id,
            this.selectedSubject.id,
            this.curriculumCurrType,
            this.applyDefConf.checked
          );
          this.defaultConf = false;
        } else {
          this.applyDefConf.checked = false;
        }
      });
    }
  }

  add(action: string, defaultApplied: boolean, unitId: number = 0) {
    if (!this.curriculumCurrType) {
      this.curriculumError = 'please choose the curriculum!';
      return;
    }
    this.curriculumError = undefined;
    this.addUnitForm.reset();
    this.addLearningStandardForm.reset();
    this.action = action;
    this.defaultApplied = defaultApplied;
    this.parentUnitId = unitId;
    this.matDrawer.open();
  }

  onAddUnit() {
    if (this.addUnitForm.invalid) return;
    this._curriculumService.addUnit(
      this.defaultApplied,
      this.selectedClass,
      this.selectedSubject,
      this.selectedCurriculumType,
      this.addUnitForm.value.code,
      this.addUnitForm.value.title
    );
    this.addUnitForm.reset();
    this.matDrawer.close();
  }

  onAddLearningStandard() {
    if (this.addLearningStandardForm.invalid) return;
    this._curriculumService.addLearningStandard(
      this.defaultApplied,
      this.selectedClass,
      this.selectedSubject,
      this.parentUnitId,
      this.addLearningStandardForm.value.code,
      this.addLearningStandardForm.value.description,
      this.addLearningStandardForm.value.relatedTo
    );
    this.addLearningStandardForm.reset();
    this.matDrawer.close();
  }

  editUnit(unit: Unit) {
    this.isUEditing = true;
    this.currEditUnit = unit;
  }

  editLearningStandard(learningStandard: LearningStandard) {
    this.isLSEditing = true;
    this.currEditLearningStandard = learningStandard;
  }

  onUnitUpdate(isDefault: boolean, unitId: number) {
    let unitToUpdate: any = document.getElementById(unitId.toString());
    if (!unitToUpdate.value) {
      this.renderer.setStyle(unitToUpdate, 'border', '1px solid red');
      return;
    }
    let updatedUnitArray: any = unitToUpdate.value.split('. ');
    this._curriculumService.updateUnit(
      isDefault,
      unitId,
      this.selectedClass,
      this.selectedSubject,
      updatedUnitArray[0],
      updatedUnitArray[1]
    );
    this.isUEditing = false;
  }

  onLsUpdate(isDefault: boolean, lsId: number) {
    let lSToUpdate: any = document.getElementById(lsId.toString());
    if (!lSToUpdate.value) {
      this.renderer.setStyle(lSToUpdate, 'border', '1px solid red');
      return;
    }
    let updatedLsArray: any = lSToUpdate.value.split('. ');
    this._curriculumService.updateLearningStandard(
      isDefault,
      lsId,
      this.selectedClass,
      this.selectedSubject,
      updatedLsArray[0],
      updatedLsArray[1]
    );
    this.isLSEditing = false;
  }

  deleteUnit(isDefault: boolean, unitId: number) {
    const options = {
      title: 'Deleting Unit',
      message: 'Are you sure you want to delete this unit?',
      cancelText: 'Cancel',
      confirmText: 'Delete',
    };
    this._confirmDialogService.open(options);
    this._confirmDialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this._curriculumService.deleteUnit(
          isDefault,
          unitId,
          this.selectedClass,
          this.selectedSubject
        );
      }
    });
  }

  deleteLearningStandard(isDefault: boolean, learningStandardId: number) {
    const options = {
      title: 'Deleting Learning Standard',
      message: 'Are you sure you want to delete this learning standard?',
      cancelText: 'Cancel',
      confirmText: 'Delete',
    };
    this._confirmDialogService.open(options);
    this._confirmDialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this._curriculumService.deleteLearningStandard(
          isDefault,
          learningStandardId,
          this.selectedClass,
          this.selectedSubject
        );
      }
    });
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.addLearningStandardForm.controls['relatedTo'].patchValue([
        ...this.learningStandards.map((learningStandard) => learningStandard),
        0,
      ]);
    } else {
      this.addLearningStandardForm.controls['relatedTo'].patchValue([]);
    }
  }
}
