import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamPageTemplateComponent } from './exam-page-template.component';

describe('ExamPageTemplateComponent', () => {
  let component: ExamPageTemplateComponent;
  let fixture: ComponentFixture<ExamPageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamPageTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamPageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
