import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBankFiltersComponent } from './question-bank-filters.component';

describe('QuestionBankFiltersComponent', () => {
  let component: QuestionBankFiltersComponent;
  let fixture: ComponentFixture<QuestionBankFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionBankFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBankFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
