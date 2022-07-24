import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BlendedLearningService } from 'src/app/modules/_services/blendedLearningService';

@Component({
  selector: 'app-new-learning-path',
  templateUrl: './new-learning-path.component.html',
  styleUrls: ['./new-learning-path.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewLearningPathComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper | null = null;
  step: number = 0;
  resetForms: Subject<void> = new Subject<void>();

  toLearningPathSteps: Subject<void> = new Subject<void>();
  toSaveAndFinish: Subject<void> = new Subject<void>();

  validLearningPathDetailsForm: boolean = false;
  validLearningPathStepsForm: boolean = false;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _blendedLearningService: BlendedLearningService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onStepChange(event: any): void {
    this.step = event.selectedIndex;
  }

  nextStep(): void {
    if (this.stepper) {
      if (this.step === 0) {
        this.toLearningPathSteps.next();
        if (this.validLearningPathDetailsForm) {
          this.step++;
          setTimeout(() => {
            this.stepper?.next();
          }, 100);
        }
      } else if (this.step === 1) {
        this.toSaveAndFinish.next();
        if (this.validLearningPathStepsForm) {
          console.log("I'm clicking here");
          this.step++;
          setTimeout(() => {
            this.router.navigate(['blended-learning', 'my-learning-path', '1']);

            this.stepper?.next();
          }, 100);
        }
      }
    }
  }

  addNewLPStep() {
    this._blendedLearningService.addNewLPSteps();
  }

  validateLearningPathDetailsForm(event: any) {
    this.validLearningPathDetailsForm = event;
  }

  validateLearningPathStepsForm(event: any) {
    this.validLearningPathStepsForm = event;
  }

  cancel() {
    if (this.stepper) {
      console.log('Ana bel cancel');
      this.step = 0;
      this.validLearningPathDetailsForm = false;
      this.validLearningPathStepsForm = false;
      this._blendedLearningService.resetForms();
      this.stepper.reset();
    }
  }
}
