import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionMcqAssessComponent } from './madquestion-mcq-assess.component';

describe('MadquestionMcqAssessComponent', () => {
  let component: MadquestionMcqAssessComponent;
  let fixture: ComponentFixture<MadquestionMcqAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionMcqAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionMcqAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
