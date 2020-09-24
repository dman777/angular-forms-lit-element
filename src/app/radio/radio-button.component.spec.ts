import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';


import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { AtlasRadioButton } from './radio-button.component';
import { AtlasRadioGroupConfig } from './radio-group.model';

describe('AtlasRadioButton', () => {
  let component: AtlasRadioButton;
  let fixture: ComponentFixture<AtlasRadioButton>;
  let radioInput: DebugElement;
  let matRadio: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatRadioModule
      ],
      declarations: [AtlasRadioButton],
      providers: [AtlasErrorsHandlerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasRadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matRadio = fixture.debugElement.query(By.css('mat-radio-button'));
    radioInput = fixture.debugElement.query(By.css('input[type=radio]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expect to set the aria-describedby', () => {
    const ariaDescribedby = 'I am aria description for radio button';
    component.ariaDescribedby = ariaDescribedby;
    fixture.detectChanges();

    expect(radioInput.nativeElement.attributes.getNamedItem('aria-describedby').value).toEqual(ariaDescribedby);
  });

  it('expect to set the aria-label', () => {
    const ariaLabel = 'I am a radio button';
    component.ariaLabel = ariaLabel;
    fixture.detectChanges();

    expect(radioInput.nativeElement.attributes.getNamedItem('aria-label').value).toEqual(ariaLabel);
  });

  it('expect to set the aria-labelledby', () => {
    const ariaLabelledby = 'I am label for radio button';
    component.ariaLabelledby = ariaLabelledby;
    fixture.detectChanges();

    expect(radioInput.nativeElement.attributes.getNamedItem('aria-labelledby').value).toEqual(ariaLabelledby);
  });

  it('expect to set the caption for radio button', () => {

    const errorHandlerSpy = spyOn(component.errorsHandlerService, 'handleError');
    const errorMessage = 'Caption for length exceeds 150 character limit';
    let caption;

    // To set the valid caption
    caption = 'I am a caption for radio button';
    component.caption = caption;
    fixture.detectChanges();

    expect(matRadio.nativeElement.textContent).toContain(caption);

    // To set the invalid caption
    caption = `I am a caption for radio button I am a caption for radio button I am a caption for radio button
    I am a caption for radio button I am a caption for radio button I am a caption for radio button`;
    component.caption = caption;
    fixture.detectChanges();

    expect(matRadio.nativeElement.textContent).toContain('');
    expect(errorHandlerSpy.calls.any()).toEqual(true);
    expect(errorHandlerSpy.calls.argsFor(0)[0].message).toEqual(errorMessage);
  });

  it('expect to set the radio button: checked/unchecked', () => {
    let checked = true;
    component.checked = checked;
    fixture.detectChanges();

    expect(component.checked).toEqual(checked);


    checked = false;
    component.checked = checked;
    fixture.detectChanges();

    expect(component.checked).toEqual(checked);


    checked = null;
    component.checked = checked;
    fixture.detectChanges();

    expect(component.checked).toBeFalsy();

  });

  it('expect to set the color for radio button', () => {
    // To set the color primary
    component.color = 'primary';
    fixture.detectChanges();

    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-color').value).toEqual(component.color);

    // To set the color accent
    component.color = 'accent';
    fixture.detectChanges();

    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-color').value).toEqual(component.color);

    // To set the color warn
    component.color = 'warn';
    fixture.detectChanges();

    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-color').value).toEqual(component.color);

    // To set the color undefined
    component.color = undefined;
    fixture.detectChanges();

    expect(matRadio.nativeElement.attributes.getNamedItem('ng-reflect-color')).toBeNull();
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

  it('expect to set the id for radio button', () => {
    const id = 'radio-id';
    component.id = id;
    fixture.detectChanges();

    expect(matRadio.nativeElement.attributes.getNamedItem('id').value).toEqual(id);
  });

  it('expect to set the input id for radio button', () => {
    const id = 'radio-id';
    const inputId = 'radio-id-input';
    component.id = id;
    component.inputId = inputId;
    fixture.detectChanges();

    expect(radioInput.nativeElement.attributes.getNamedItem('id').value).toEqual(inputId);
  });

  it('expect to set the label position of radio button', () => {
    let labelPosition;
    const errorHandlerSpy = spyOn(component.errorsHandlerService, 'handleError');
    const errorMessage = `Label position for radio button '${component.id}' should be 'before' or 'after'`;
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

  it('expect to set the name for radio button', () => {
    // To set the name
    const name = 'radiobutton-name';
    component.name = name;
    fixture.detectChanges();

    expect(radioInput.nativeElement.attributes.getNamedItem('name').value).toEqual(name);
  });

  it('expect to set the radio group attribute for radio button', () => {
    let radioGroup;
    // To set the valid radioGroup value
    radioGroup = AtlasRadioGroupConfig;
    component.radioGroup = radioGroup;
    fixture.detectChanges();
    expect(component.radioGroup).toEqual(radioGroup);

    // To set the invalid radioGroup value
    radioGroup = undefined;
    component.radioGroup = radioGroup;
    fixture.detectChanges();
    expect(component.radioGroup).toEqual(radioGroup);
  });

  it('expect to set the required attribute for the radio button', () => {
    let required;
    // To set the required attribute true
    required = true;
    component.required = required;
    fixture.detectChanges();
    expect(radioInput.nativeElement.hasAttribute('required')).toBe(required);
    expect(component.required).toEqual(required);

    // To set the required attribute false
    required = false;
    component.required = required;
    fixture.detectChanges();
    expect(radioInput.nativeElement.hasAttribute('required')).toBe(required);
    expect(component.required).toEqual(required);

    // To set the required attribute undefined
    required = undefined;
    component.required = required;
    fixture.detectChanges();
    expect(radioInput.nativeElement.hasAttribute('required')).toBe(false);
    expect(component.required).toEqual(required);
  });

  it('expect to set the value to the radio button', () => {
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

  it('#selectedOption(): expect object when user clicks on radio button', () => {
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
