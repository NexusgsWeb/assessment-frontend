import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionDescriptiveAssessComponent } from './madquestion-descriptive-assess.component';

describe('MadquestionDescriptiveAssessComponent', () => {
  let component: MadquestionDescriptiveAssessComponent;
  let fixture: ComponentFixture<MadquestionDescriptiveAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionDescriptiveAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionDescriptiveAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
