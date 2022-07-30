import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.css'],
})
export class EditorialComponent implements OnInit {
  editorialFormGroup: FormGroup = this._formBuilder.group({
    id: Date.now() + Math.floor(Math.random() * 100),
    learningPathStepsId: [''],
    activityCategory: ['Add Content Activity'],
    activityType: ['Editorial'],
    title: [''],
    reference: [''],
    expectedDuration: {
      duration: [2],
      unitOftime: ['d'],
    },
    startDate: [null],
    endDate: [null],
    description: [''],
    domains: [],
  });

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {}
}
