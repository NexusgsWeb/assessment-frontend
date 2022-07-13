import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css'],
})
export class ContactDetailsComponent implements OnInit {
  @Input() StudentMetaData;

  constructor() {}

  ngOnInit(): void {
    console.log(this.StudentMetaData);
  }
}
