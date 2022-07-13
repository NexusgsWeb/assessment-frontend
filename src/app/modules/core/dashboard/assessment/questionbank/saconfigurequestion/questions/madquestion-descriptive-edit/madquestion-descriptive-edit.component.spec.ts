import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionDescriptiveEditComponent } from './madquestion-descriptive-edit.component';

describe('MADQuestionDescriptiveEditComponent', () => {
  let component: MADQuestionDescriptiveEditComponent;
  let fixture: ComponentFixture<MADQuestionDescriptiveEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionDescriptiveEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionDescriptiveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
