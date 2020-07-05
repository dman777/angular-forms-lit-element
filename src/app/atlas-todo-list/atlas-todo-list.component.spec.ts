import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasTodoListComponent } from './atlas-todo-list.component';

describe('AtlasTodoListComponent', () => {
  let component: AtlasTodoListComponent;
  let fixture: ComponentFixture<AtlasTodoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtlasTodoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasTodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
