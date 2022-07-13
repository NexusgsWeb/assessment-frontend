import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSchoolsComponent } from './organization-schools.component';

describe('OrganizationSchoolsComponent', () => {
  let component: OrganizationSchoolsComponent;
  let fixture: ComponentFixture<OrganizationSchoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationSchoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
