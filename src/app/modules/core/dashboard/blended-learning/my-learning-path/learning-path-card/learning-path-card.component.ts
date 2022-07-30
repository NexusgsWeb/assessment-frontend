import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { LearningPath } from 'src/app/modules/Models/learningPath';
import { BlendedLearningService } from 'src/app/modules/_services/blendedLearningService';

@Component({
  selector: 'app-learning-path-card',
  templateUrl: './learning-path-card.component.html',
  styleUrls: ['./learning-path-card.component.css'],
})
export class LearningPathCardComponent implements OnInit {
  color: ThemePalette = 'primary';
  value = 50;
  backgroundSpinnerColor: ThemePalette = 'primary';
  backgroundSpinnerValue = 75;

  @Input() cardData: LearningPath;

  constructor(
    private router: Router,
    private _blendedLearningService: BlendedLearningService
  ) {}

  ngOnInit(): void {}

  editPath(learningPathId: number) {
    this._blendedLearningService.selectLearningPath(learningPathId);
    this.router.navigateByUrl('/blended-learning/new-learning-path');
  }
}
