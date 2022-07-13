import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionDateComponent } from './madquestion-date.component';

describe('MADQuestionDateComponent', () => {
  let component: MADQuestionDateComponent;
  let fixture: ComponentFixture<MADQuestionDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
