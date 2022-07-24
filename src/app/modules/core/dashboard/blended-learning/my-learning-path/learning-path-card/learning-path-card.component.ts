import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

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

  constructor() {}

  ngOnInit(): void {}
}
