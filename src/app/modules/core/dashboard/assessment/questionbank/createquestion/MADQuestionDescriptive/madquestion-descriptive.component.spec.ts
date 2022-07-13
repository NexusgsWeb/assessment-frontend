import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionDescriptiveComponent } from './madquestion-descriptive.component';

describe('MADQuestionDescriptiveComponent', () => {
  let component: MADQuestionDescriptiveComponent;
  let fixture: ComponentFixture<MADQuestionDescriptiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionDescriptiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionDescriptiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
