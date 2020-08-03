import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { AtlasChipList } from './chip-list.component';

describe('AtlasChipList', () => {
  let component: AtlasChipList;
  let fixture: ComponentFixture<AtlasChipList>;
  let matChipList: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtlasChipList ],
      imports: [
        MatChipsModule,
        RouterTestingModule
      ],
      providers: [ AtlasErrorsHandlerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasChipList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matChipList = fixture.debugElement.query(By.css('mat-chip-list'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect to set the aria orientation for chips', () => {
    let orientation;
    const errorHandlerSpy = spyOn(component.errorsHandlerService, 'handleError');
    const errorMessage = `Aria orientation for chips should be 'horizontal' or 'vertical'`;

    // To set the direction to horizontal
    orientation = 'horizontal';
    component.ariaOrientation = orientation;
    fixture.detectChanges();
     expect(component.ariaOrientation).toEqual(orientation);

     // To set the direction to vertical
     orientation = 'vertical';
    component.ariaOrientation = orientation;
    fixture.detectChanges();
    expect(component.ariaOrientation).toEqual(orientation);

    // To set the direction to horizontal
    orientation = 'test';
    component.ariaOrientation = orientation;
    fixture.detectChanges();
    expect(component.ariaOrientation).toEqual('horizontal');
    expect(errorHandlerSpy.calls.any()).toEqual(true);
    expect(errorHandlerSpy.calls.argsFor(0)[0].message).toEqual(errorMessage);
  });

  it('expect to set the multiple attribute for the chips', () => {
    let multiple;
    // To set the valid multiple value
    multiple = true;
    component.multiple = multiple;
    fixture.detectChanges();
    expect(matChipList.nativeElement.hasAttribute('ng-reflect-multiple')).toBe(true);
    expect(component.multiple).toEqual(multiple);

    // To set the multiple value to false
    multiple = false;
    component.multiple = multiple;
    fixture.detectChanges();
    expect(matChipList.nativeElement.attributes.getNamedItem('ng-reflect-multiple').value).toEqual('false');
    expect(component.multiple).toEqual(multiple);
  });

  it('expect to set the selectable attribute for the chips', () => {
    let selectable;
    // To set the valid selectable value
    selectable = true;
    component.selectable = selectable;
    fixture.detectChanges();
    expect(matChipList.nativeElement.hasAttribute('ng-reflect-selectable')).toBe(true);
    expect(component.selectable).toEqual(selectable);

    // To set the selectable value to false
    selectable = false;
    component.selectable = selectable;
    fixture.detectChanges();
    expect(matChipList.nativeElement.attributes.getNamedItem('ng-reflect-selectable').value).toEqual('false');
    expect(component.selectable).toEqual(selectable);
  });

  // To verify events when user clicks on remove icon
  it('#chipRemoved() when user clicks on remove icon', () => {
    const spyChipRemoved = spyOn(component.removed, 'emit');

    component.chipRemoved(event);
    fixture.detectChanges();

    expect(spyChipRemoved.calls.any()).toEqual(true);
  });

});
