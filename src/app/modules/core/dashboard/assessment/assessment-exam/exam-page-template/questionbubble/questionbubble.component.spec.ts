import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionbubbleComponent } from './questionbubble.component';

describe('QuestionbubbleComponent', () => {
  let component: QuestionbubbleComponent;
  let fixture: ComponentFixture<QuestionbubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionbubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionbubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
