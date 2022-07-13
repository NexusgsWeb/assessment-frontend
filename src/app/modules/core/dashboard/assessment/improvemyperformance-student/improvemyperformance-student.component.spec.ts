import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovemyperformanceStudentComponent } from './improvemyperformance-student.component';

describe('ImprovemyperformanceStudentComponent', () => {
  let component: ImprovemyperformanceStudentComponent;
  let fixture: ComponentFixture<ImprovemyperformanceStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovemyperformanceStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovemyperformanceStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
