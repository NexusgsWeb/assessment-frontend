import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactDetailsComponent } from './employee-contact-details.component';

describe('EmployeeContactDetailsComponent', () => {
  let component: EmployeeContactDetailsComponent;
  let fixture: ComponentFixture<EmployeeContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeContactDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
