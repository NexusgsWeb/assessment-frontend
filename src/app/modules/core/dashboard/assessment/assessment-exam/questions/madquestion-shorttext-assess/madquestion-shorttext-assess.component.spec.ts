import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadquestionShorttextAssessComponent } from './madquestion-shorttext-assess.component';

describe('MadquestionShorttextAssessComponent', () => {
  let component: MadquestionShorttextAssessComponent;
  let fixture: ComponentFixture<MadquestionShorttextAssessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadquestionShorttextAssessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MadquestionShorttextAssessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
