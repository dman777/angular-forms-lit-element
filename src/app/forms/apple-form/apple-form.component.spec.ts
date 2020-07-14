import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppleFormComponent } from './apple-form.component';

describe('AppleFormComponent', () => {
  let component: AppleFormComponent;
  let fixture: ComponentFixture<AppleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
