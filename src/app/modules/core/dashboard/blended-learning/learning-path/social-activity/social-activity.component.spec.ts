import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialActivityComponent } from './social-activity.component';

describe('SocialActivityComponent', () => {
  let component: SocialActivityComponent;
  let fixture: ComponentFixture<SocialActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
