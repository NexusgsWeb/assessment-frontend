import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudItemIMPTComponent } from './stud-item-impt.component';

describe('StudItemIMPTComponent', () => {
  let component: StudItemIMPTComponent;
  let fixture: ComponentFixture<StudItemIMPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudItemIMPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudItemIMPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
