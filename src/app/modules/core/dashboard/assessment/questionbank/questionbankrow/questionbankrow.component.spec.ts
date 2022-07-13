import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionbankrowComponent } from './questionbankrow.component';

describe('QuestionbankrowComponent', () => {
  let component: QuestionbankrowComponent;
  let fixture: ComponentFixture<QuestionbankrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionbankrowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionbankrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
