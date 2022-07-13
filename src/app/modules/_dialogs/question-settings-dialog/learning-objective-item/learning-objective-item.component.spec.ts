import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningObjectiveItemComponent } from './learning-objective-item.component';

describe('LearningObjectiveItemComponent', () => {
  let component: LearningObjectiveItemComponent;
  let fixture: ComponentFixture<LearningObjectiveItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningObjectiveItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningObjectiveItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
