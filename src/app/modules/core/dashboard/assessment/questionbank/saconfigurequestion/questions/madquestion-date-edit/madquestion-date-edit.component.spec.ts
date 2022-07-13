import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionDateEditComponent } from './madquestion-date-edit.component';

describe('MADQuestionDateEditComponent', () => {
  let component: MADQuestionDateEditComponent;
  let fixture: ComponentFixture<MADQuestionDateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionDateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionDateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
