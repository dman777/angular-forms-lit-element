import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { AtlasChip } from './chip.component';


describe('AtlasChip', () => {
  let component: AtlasChip;
  let fixture: ComponentFixture<AtlasChip>;
  let matChip: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatIconModule,
        MatRippleModule
      ],
      declarations: [AtlasChip],
      providers: [AtlasErrorsHandlerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matChip = fixture.debugElement.query(By.css('mat-chip'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect to set the color for chip', () => {
    // To set the color primary
    component.color = 'primary';
    fixture.detectChanges();

    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-color').value).toEqual(component.color);

    // To set the color accent
    component.color = 'accent';
    fixture.detectChanges();

    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-color').value).toEqual(component.color);

    // To set the color warn
    component.color = 'warn';
    fixture.detectChanges();

    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-color').value).toEqual(component.color);

    // To set the color undefined
    component.color = undefined;
    fixture.detectChanges();

    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-color')).toBeNull();
  });

  it('expect to set the disable ripple', () => {

    let disableRipple;
    // To set the disableRipple false
    disableRipple = false;
    component.disableRipple = disableRipple;

    expect(component.disableRipple).toBeFalsy();

    // To set the disableRipple true
    disableRipple = true;
    component.disableRipple = disableRipple;

    expect(component.disableRipple).toBeTruthy();

    // To set the disableRipple undefined
    disableRipple = undefined;
    component.disableRipple = disableRipple;

    expect(component.disableRipple).toBeFalsy();
  });

  it('expect to set the disabled attribute for the chips', () => {
    let disabled;
    // To set the valid disabled value
    disabled = true;
    component.disabled = disabled;
    fixture.detectChanges();
    expect(matChip.nativeElement.hasAttribute('ng-reflect-disabled')).toBe(true);
    expect(component.disabled).toEqual(disabled);

    // To set the disabled value to false
    disabled = false;
    component.disabled = disabled;
    fixture.detectChanges();
    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-disabled').value).toEqual('false');
    expect(component.disabled).toEqual(disabled);
  });

  it('expect to set the removable attribute for the chips', () => {
    let removable;
    // To set the valid disabled value
    removable = true;
    component.removable = removable;
    fixture.detectChanges();
    expect(matChip.nativeElement.hasAttribute('ng-reflect-removable')).toBe(true);
    expect(component.removable).toEqual(removable);

    // To set the removable value to false
    removable = false;
    component.removable = removable;
    fixture.detectChanges();
    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-removable').value).toEqual('false');
    expect(component.removable).toEqual(removable);
  });

  it('expect to set the selectable attribute for the chips', () => {
    let selectable;
    // To set the valid selectable value
    selectable = true;
    component.selectable = selectable;
    fixture.detectChanges();
    expect(matChip.nativeElement.hasAttribute('ng-reflect-selectable')).toBe(true);
    expect(component.selectable).toEqual(selectable);

    // To set the selectable value to false
    selectable = false;
    component.selectable = selectable;
    fixture.detectChanges();
    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-selectable').value).toEqual('false');
    expect(component.selectable).toEqual(selectable);
  });

  it('expect to set the selected attribute for the chips', () => {
    let selected;
    // To set the valid selected value
    selected = true;
    component.selected = selected;
    fixture.detectChanges();
    expect(matChip.nativeElement.hasAttribute('ng-reflect-selected')).toBe(true);
    expect(component.selected).toEqual(selected);

    // To set the selected value to false
    selected = false;
    component.selected = selected;
    fixture.detectChanges();
    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-selected').value).toEqual('false');
    expect(component.selected).toEqual(selected);
  });

  it('expect to set the value to the chip', () => {
    let value;
    // To set the value as string
    value = 'Chip 1';
    component.value = value;
    fixture.detectChanges();
    expect(matChip.nativeElement.attributes.getNamedItem('ng-reflect-value').value).toEqual(value);

    // To set the value as undefined
    value = undefined;
    component.value = value;
    fixture.detectChanges();
    expect(matChip.nativeElement.hasAttribute('ng-reflect-value')).toBe(false);
  });

  // To verify events when user clicks on remove icon
  it('#chipRemoved() when user clicks on remove icon', () => {
    const spyChipRemoved = spyOn(component.removed, 'emit');

    component.chipRemoved(event);
    fixture.detectChanges();

    expect(spyChipRemoved.calls.any()).toEqual(true);
  });
});
