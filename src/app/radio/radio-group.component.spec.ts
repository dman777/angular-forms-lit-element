import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';

import { AtlasRadioGroup } from './radio-group.component';
import { AtlasRadioButtonConfig } from './radio-button.model';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';


describe('AtlasRadioGroup', () => {
  let component: AtlasRadioGroup;
  let fixture: ComponentFixture<AtlasRadioGroup>;
  let matRadio: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtlasRadioGroup ],
      imports: [
        MatRadioModule,
        ReactiveFormsModule
      ],
      providers: [ AtlasErrorsHandlerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasRadioGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matRadio = fixture.debugElement.query(By.css('mat-radio-group'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect to set the direction for radio group', () => {
    let direction;
    const errorHandlerSpy = spyOn(component.errorsHandlerService, 'handleError');
    const errorMessage = `Layout for radio group direction should be 'horizontal' or 'vertical'`;

    // To set the direction to horizontal
    direction = 'horizontal';
    component.direction = direction;
    fixture.detectChanges();
     expect(component.direction).toEqual(direction);

     // To set the direction to vertical
    direction = 'vertical';
    component.direction = direction;
    fixture.detectChanges();
    expect(component.direction).toEqual(direction);

    // To set the direction to horizontal
    direction = 'test';
    component.direction = direction;
    fixture.detectChanges();
    expect(component.direction).toEqual('horizontal');
    expect(errorHandlerSpy.calls.any()).toEqual(true);
    expect(errorHandlerSpy.calls.argsFor(0)[0].message).toEqual(errorMessage);
  });

  it('expect to set the radio group form Control', () => {
    let formControl;
    formControl = new FormControl('', []);
    component.formControl = formControl;
    expect(component.formControl.value).toEqual('');

    formControl = new FormControl({ value: true, disabled: true }, [Validators.required]);
    component.formControl = formControl;

    expect(component.formControl.value).toEqual(true);
    expect(component.formControl.disabled).toEqual(true);
    expect(component.formControl.validator).toBeDefined();

  });

  it('expect to set the label position of radio group', () => {
    let labelPosition;
    const errorHandlerSpy = spyOn(component.errorsHandlerService, 'handleError');
    const errorMessage = `Label position for radio group should be 'before' or 'after'`;
    // To set the label position: after
    labelPosition = 'after';
    component.labelPosition = labelPosition;
    fixture.detectChanges();

     expect(component.labelPosition).toEqual(labelPosition);

     // To set the label position: before
    labelPosition = 'before';
    component.labelPosition = labelPosition;
    fixture.detectChanges();

     expect(component.labelPosition).toEqual(labelPosition);


     // To set the label position: test (random text)
    labelPosition = 'test';
    component.labelPosition = labelPosition;
    fixture.detectChanges();
    expect(component.labelPosition).toEqual('');
    expect(errorHandlerSpy.calls.any()).toEqual(true);
    expect(errorHandlerSpy.calls.argsFor(0)[0].message).toEqual(errorMessage);
  });

  it('expect to set the name for radio group', () => {
    // To set the name
    const name = 'radiogroup-name';
    component.name = name;
    fixture.detectChanges();
    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-name').value).toEqual(name);
  });


  it('expect to set the required attribute for the radio group', () => {
    let required;
    // To set the required attribute true
    required = true;
    component.required = required;
    fixture.detectChanges();
    expect(matRadio.nativeElement.hasAttribute('required')).toBe(required);
    expect(component.required).toEqual(required);

     // To set the required attribute false
    required = false;
    component.required = required;
    fixture.detectChanges();
    expect(matRadio.nativeElement.hasAttribute('required')).toBe(required);
    expect(component.required).toEqual(required);

     // To set the required attribute undefined
    required = undefined;
    component.required = required;
    fixture.detectChanges();
    expect(matRadio.nativeElement.hasAttribute('required')).toBe(false);
    expect(component.required).toEqual(required);
  });

  it('expect to set the selected attribute for the radio group', () => {
    let selected;
    // To set the valid selected value
    selected = AtlasRadioButtonConfig;
    component.selected = selected;
    fixture.detectChanges();
    expect(matRadio.nativeElement.hasAttribute('ng-reflect-selected')).toBe(true);
    expect(component.selected).toEqual(selected);

    // To set the invalid selected value
    selected = undefined;
    component.selected = selected;
    fixture.detectChanges();
    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-selected').value).toEqual('');
    expect(component.selected).toEqual(selected);
  });

  it('expect to set the value to the radio group', () => {
    let value;
    // To set the value as string
    value = 'Radio button';
    component.value = value;
    fixture.detectChanges();
    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-value').value).toEqual(value);

     // To set the value as undefined
    value = undefined;
    component.value = value;
    fixture.detectChanges();
    expect(matRadio.nativeElement.hasAttribute('ng-reflect-value')).toBe(false);
  });

  it('#selectedOption(): expect object when user clicks on radio group', () => {
    const RadioClickSpy = spyOn(component.change, 'emit');

    const radioValue = {
      'value': '1',
      'source': {
        'id': 'radio_1',
        'name': 'radio',
        'checked': 'true'
      }
    };

    const radioOutput = {
      'value': '1',
      'source': {
        'id': 'radio_1',
        'name': 'radio',
        'checked': 'true'
      }
    };

    const event: MatRadioChange = new MatRadioChange(null, radioValue);

    component.selectedOption(event);
    fixture.detectChanges();
    expect(RadioClickSpy.calls.any()).toEqual(true);
    expect(RadioClickSpy.calls.argsFor(0)[0].value.value).toEqual(radioOutput.value);
  });

});
