import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainLOItemComponent } from './domain-loitem.component';

describe('DomainLOItemComponent', () => {
  let component: DomainLOItemComponent;
  let fixture: ComponentFixture<DomainLOItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainLOItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainLOItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
