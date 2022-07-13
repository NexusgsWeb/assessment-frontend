import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOItemIMPComponent } from './loitem-imp.component';

describe('LOItemIMPComponent', () => {
  let component: LOItemIMPComponent;
  let fixture: ComponentFixture<LOItemIMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LOItemIMPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LOItemIMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
