import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
export class PersonalDetailsComponent implements OnInit {
  @Input() StudentMetaData;
  constructor() {}

  ngOnInit(): void {
    console.log(this.StudentMetaData)
  }
}
