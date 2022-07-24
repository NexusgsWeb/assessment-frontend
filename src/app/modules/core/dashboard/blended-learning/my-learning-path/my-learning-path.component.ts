import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Class } from 'src/app/modules/Models/Class';
import { Subject } from 'src/app/modules/Models/Subject';
import { BlendedLearningService } from 'src/app/modules/_services/blendedLearningService';
import { LearningPath } from '@models/learningPath';

@Component({
  selector: 'app-my-learning-path',
  templateUrl: './my-learning-path.component.html',
  styleUrls: ['./my-learning-path.component.css'],
})
export class MyLearningPathComponent implements OnInit {
  learningPath: LearningPath;

  selectedClass: Class = {
    id: '',
    name: 'Select Class',
    code: '',
    schoolId: '',
    cycleId: '',
    isActive: false,
    createdAt: '',
    updatedAt: '',
  };
  selectedSubject: Subject = {
    id: '',
    name: 'Select Subject',
    code: '',
    weight: 0,
    sectionName: '',
    sectionId: '',
    expand: false,
    subjectOrder: 0,
    sections: [],
    classId: '',
    edit: false,
    displayName: '',
    curriculumId: '',
    subjectCode: '',
    gradeCode: '',
    curriculum: null,
  };

  classes$ = this._blendedLearningService.classes$;
  subjects$ = this._blendedLearningService.subjects$;
  learningPath$ = this._blendedLearningService.learningPath$;

  constructor(
    private router: Router,
    private _blendedLearningService: BlendedLearningService
  ) {}

  ngOnInit(): void {}

  didClickNavigate(PATH, _param?) {
    console.log(PATH);
    this.router.navigateByUrl(PATH);
  }

  filter() {
    if (this.selectedClass.id != '' && this.selectedSubject.id != '') {
      this._blendedLearningService.getLearningPath(
        this.selectedClass,
        this.selectedSubject
      );
    }

    this.learningPath$.subscribe(
      (learningPath: LearningPath) => (this.learningPath = learningPath)
    );
  }
}
