import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MADQuestionTFEditComponent } from './madquestion-tfedit.component';

describe('MADQuestionTFEditComponent', () => {
  let component: MADQuestionTFEditComponent;
  let fixture: ComponentFixture<MADQuestionTFEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MADQuestionTFEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MADQuestionTFEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
