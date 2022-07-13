import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovemyperformanceTeacherComponent } from './improvemyperformance-teacher.component';

describe('ImprovemyperformanceTeacherComponent', () => {
  let component: ImprovemyperformanceTeacherComponent;
  let fixture: ComponentFixture<ImprovemyperformanceTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovemyperformanceTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovemyperformanceTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
