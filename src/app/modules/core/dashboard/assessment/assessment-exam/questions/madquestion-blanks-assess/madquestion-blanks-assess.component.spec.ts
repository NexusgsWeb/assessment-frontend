import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionBlanksAssessComponent } from './madquestion-blanks-assess.component';

describe('MadquestionBlanksAssessComponent', () => {
  let component: MadquestionBlanksAssessComponent;
  let fixture: ComponentFixture<MadquestionBlanksAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionBlanksAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionBlanksAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
