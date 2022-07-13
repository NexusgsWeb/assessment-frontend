import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from 'src/app/modules/Models/Student';
import { ImgURL } from 'src/app/shared/static_data/apiURL';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentComponent implements OnInit {
  SelectedStudent: any;
  StudentMetaData: any;
  S3Link;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('Loading students...');
    console.log(this.route.snapshot.data['StudentData'])
    this.SelectedStudent = this.route.snapshot.data['StudentData'].data;
    this.StudentMetaData = this.route.snapshot.data['StudentData'].data;
    // this.S3Link = ImgURL + this.StudentMetaData.user.profilePictureUrl;
    // console.log(this.S3Link);
    // console.log(this.StudentMetaData.user.profilePictureUrl);
    console.log(this.StudentMetaData);
  }
}
