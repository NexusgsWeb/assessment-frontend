import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeApplicationComponent } from './employee-application.component';

describe('EmployeeApplicationComponent', () => {
  let component: EmployeeApplicationComponent;
  let fixture: ComponentFixture<EmployeeApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
