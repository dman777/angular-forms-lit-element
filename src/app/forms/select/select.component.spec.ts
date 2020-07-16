import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtlasSelect } from './select.component';
import { ValidationErrors, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AtlasSelectOptionGroup, AtlasSelectOption } from './select.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

describe('AtlasSelect', () => {
  let component: AtlasSelect;
  let fixture: ComponentFixture<AtlasSelect>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtlasSelect],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasSelect);
    // HACK: Getting ngControl reference
    (fixture.componentInstance as any).ngControl = new FormControl();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.registerOnTouched(() => 'registerOnTouched');
    component.registerOnChange(() => 'registerOnChange');
    expect(component).toBeTruthy();
  });

  it('#getErrorMessage()', () => {
    let activatedErrors: ValidationErrors = {
      required: true
    };
    const errorSet: AtlasFormFieldErrors = new AtlasFormFieldErrors();

    expect(component.getErrorMessage(activatedErrors, errorSet)).toEqual(new AtlasFormFieldErrors().getErrorMessage('required'));

    // In case no error matched
    activatedErrors = {
      typo_error_name: 'some value'
    };
    expect(component.getErrorMessage(activatedErrors, errorSet)).toEqual('Wrong Input');
  });

  it('#updateError() update Error', () => {
    let isInputInvalid = true;
    const activeErrors = {
      required: true
    };
    const atlasFormFieldErrors = new AtlasFormFieldErrors();

    component.updateError(isInputInvalid, activeErrors, atlasFormFieldErrors);
    expect(component.errorMessage).toEqual(atlasFormFieldErrors.getErrorMessage('required'));

    isInputInvalid = false;

    component.updateError(isInputInvalid, activeErrors, atlasFormFieldErrors);
    expect(component.errorMessage).toEqual('');
  });

  it('#isItemGroup() Given Item is a select group or option', () => {
    const group: AtlasSelectOptionGroup = {
      label: 'Test Group',
      value: [
        {
          label: 'G-Option',
          value: 'G-Option'
        }
      ]
    };
    const option: AtlasSelectOption = {
      label: 'Option',
      value: 'Option'
    };

    expect(component.isItemGroup(group)).toEqual('group');
    expect(component.isItemGroup(option)).toEqual('option');
    expect(component.isItemGroup(null)).toEqual(null);
  });

  it('#isPanelToggled() Checks the panel if toggled', () => {
    const openedChangeSpy = spyOn(component.openedChange, 'emit');

    component.isPanelToggled(true);
    expect(openedChangeSpy.calls.count()).toEqual(1);
    expect(openedChangeSpy.calls.allArgs()[0][0]).toEqual(true);

    component.isPanelToggled(false);
    expect(openedChangeSpy.calls.count()).toEqual(2);
    expect(openedChangeSpy.calls.allArgs()[1][0]).toEqual(false);
  });

  it('#setDisabledState() When component is disabled', () => {
    const selectControlSpy = spyOn(component.selectControl, 'disable');

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(selectControlSpy.calls.count()).toEqual(1);

    component.setDisabledState(false);
    fixture.detectChanges();
    expect(selectControlSpy.calls.count()).toEqual(1);
  });

  it('#writeValue() Write value from CVA', () => {
    const selectControlSpy = spyOn(component.selectControl, 'setValue');

    const input = 'Test Input';
    component.writeValue(input);
    fixture.detectChanges();
    expect(selectControlSpy.calls.count()).toEqual(1);
    expect(selectControlSpy.calls.allArgs()[0][0]).toEqual(input);
  });

  it('Updating errors', () => {
    const errorMsg = 'First Name is required!';
    const isInputInvalid = true;
    const activeErrors: ValidationErrors = {
      required: true
    };
    component.errors = undefined;

    const errorSet = new AtlasFormFieldErrors();
    errorSet.setError('required', errorMsg);

    component.errors = errorSet;
    component.updateError(isInputInvalid, activeErrors, errorSet);
    expect(component.errorMessage).toEqual(errorMsg);

  });
});
