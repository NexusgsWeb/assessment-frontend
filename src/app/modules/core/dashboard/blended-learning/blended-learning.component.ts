import { Component, OnInit } from '@angular/core';
import { BlendedLearningService } from 'src/app/modules/_services/blendedLearningService';

@Component({
  selector: 'app-blended-learning',
  templateUrl: './blended-learning.component.html',
  styleUrls: ['./blended-learning.component.css'],
})
export class BlendedLearningComponent implements OnInit {
  constructor(private _blendedLearningService: BlendedLearningService) {}

  ngOnInit(): void {
    this._blendedLearningService.getClasses();
    this._blendedLearningService.getSubjects();
  }
}
