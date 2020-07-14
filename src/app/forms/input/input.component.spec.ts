import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks, inject } from '@angular/core/testing';
import { FocusMonitor, FocusOrigin, A11yModule } from '@angular/cdk/a11y';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { IMaskModule } from 'angular-imask';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { AtlasInputTestComponent } from './testing/atlas-input-test.component';
import { AtlasInputModule } from './input.module';
import { AtlasInput } from './input.component';
import { ObserversModule } from '@angular/cdk/observers';

/**
 * Utility to dispatch any event on a Node.
 * @docs-private
 */
function dispatchEvent<T extends Event>(node: Node | Window, event: T): T {
  node.dispatchEvent(event);
  return event;
}

/**
 * Shorthand to dispatch a fake event on a specified node.
 * @docs-private
 */
function dispatchFakeEvent(node: Node | Window, type: string, canBubble?: boolean): Event {
  return dispatchEvent(node, createFakeEvent(type, canBubble));
}


/**
 * Creates a fake event object with any desired event type.
 * @docs-private
 */
function createFakeEvent(type: string, canBubble = false, cancelable = true) {
  const event = document.createEvent('Event');
  event.initEvent(type, canBubble, cancelable);
  return event;
}

/**
 * Patches an elements focus and blur methods to emit events consistently and predictably.
 * This is necessary, because some browsers, like IE11, will call the focus handlers asynchronously,
 * while others won't fire them at all if the browser window is not focused.
 * @docs-private
 */
function patchElementFocus(element: HTMLElement) {
  element.focus = () => dispatchFakeEvent(element, 'focus');
  element.blur = () => dispatchFakeEvent(element, 'blur');
}

describe('AtlasInput', () => {
  let testComponent: AtlasInputTestComponent;
  let fixture: ComponentFixture<AtlasInputTestComponent>;
  let focusMonitor: FocusMonitor;
  let debugElementTest: DebugElement;
  let inputElementOne: HTMLElement;
  let changeHandler: (origin: FocusOrigin) => void;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AtlasInputTestComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        IMaskModule,
        AtlasInputModule,
        A11yModule,
        ObserversModule
      ]
    })
      .compileComponents();
  }));


  beforeEach(inject([FocusMonitor], (fm: FocusMonitor) => {
    fixture = TestBed.createComponent(AtlasInputTestComponent);
    debugElementTest = fixture.debugElement;
    testComponent = fixture.componentInstance;
    fixture.detectChanges();

    inputElementOne = debugElementTest.query(By.css('input')).nativeElement;
    focusMonitor = fm;

    changeHandler = jasmine.createSpy('focus origin change handler');
    focusMonitor.monitor(inputElementOne).subscribe(changeHandler);
    patchElementFocus(inputElementOne);
  }));

  it('should create component', () => {
    expect(testComponent).toBeTruthy();
  });

  it('should set the id for input', () => {

    const inputElements = debugElementTest.query(By.css('input'));

    expect(inputElements.nativeElement.attributes.getNamedItem('id').value).toContain('atlas-input-');

    // To set the id
    const id = 'input-id';
    testComponent.id = id;
    fixture.detectChanges();

    expect(inputElements.nativeElement.attributes.getNamedItem('id').value).toEqual(id);
  });


  it('should set the tabIndex for input', () => {
    const inputElements = debugElementTest.query(By.css('input'));
    expect(inputElements.nativeElement.getAttribute('tabIndex')).toBe('0');

    const tabIndex = 1;
    testComponent.tabIndex = tabIndex;
    fixture.detectChanges();
    expect(inputElements.nativeElement.getAttribute('tabIndex')).toBe('1');

    // To set the disabled true
    testComponent.disabled = true;
    fixture.detectChanges();
    expect(inputElements.nativeElement.getAttribute('tabIndex')).toBe('-1');
  });

  it('should disable the input (reactive and template driven)', () => {

    // Assert
    const inputElements = debugElementTest.queryAll(By.css('input'));

    // Act (disabling both inputs)
    testComponent.disabled = true;
    fixture.detectChanges();

    // Expect
    expect(inputElements[0].nativeElement.attributes['disabled']).toBeDefined();
    expect(inputElements[1].nativeElement.attributes['disabled']).toBeDefined();
  });

  it('should make the inputs (reactive and template driven) required', () => {

    // Assert
    const inputElements = debugElementTest.queryAll(By.css('input'));

    // Act (make required) both inputs)
    testComponent.required = true;
    fixture.detectChanges();

    // Expect
    expect(inputElements[0].nativeElement.attributes['required']).toBeDefined();
    expect(inputElements[1].nativeElement.attributes['required']).toBeDefined();
  });

  it('should set the placeholder for inputs (reactive and template driven)', () => {

    // Assert
    const inputElements = debugElementTest.queryAll(By.css('input'));
    const expectedPlaceholder = `I'm the new placeholder`;

    // Act (make required) both inputs)
    testComponent.placeholder = expectedPlaceholder;
    fixture.detectChanges();

    // Expect
    expect(inputElements[0].nativeElement.attributes['placeholder']).toBeDefined();
    expect(inputElements[0].nativeElement.attributes['placeholder'].value).toEqual(expectedPlaceholder);
    expect(inputElements[1].nativeElement.attributes['placeholder']).toBeDefined();
    expect(inputElements[1].nativeElement.attributes['placeholder'].value).toEqual(expectedPlaceholder);
  });

  it('should set the label for inputs (reactive and template driven)', () => {

    // Assert
    const inputElements = debugElementTest.queryAll(By.directive(AtlasInput));
    const expectedLabel = `I'm the new label`;

    // Act (make required) both inputs)
    testComponent.label = expectedLabel;
    fixture.detectChanges();

    // Expect
    expect(inputElements[0].nativeElement.attributes['ng-reflect-label']).toBeDefined();
    expect(inputElements[0].nativeElement.attributes['ng-reflect-label'].value).toEqual(expectedLabel);
    expect(inputElements[1].nativeElement.attributes['ng-reflect-label']).toBeDefined();
    expect(inputElements[1].nativeElement.attributes['ng-reflect-label'].value).toEqual(expectedLabel);
  });

  it('should change a label in container', async(() => {
    // Assert
    const matLabelElement = debugElementTest.queryAll(By.css('mat-label'));
    fixture.detectChanges();

    // Expect
    expect(matLabelElement[2].nativeElement.innerHTML).toEqual(testComponent.labelValue);

    // Act - changes the label value
    testComponent.changeLabel();
    fixture.detectChanges();

    // Expect
    fixture.whenStable().then(() => {
      expect(matLabelElement[2].nativeElement.innerHTML).toEqual(testComponent.labelValue);
    });
  }));

  it('should set the maxLength', () => {
    // Assert
    const inputElements = debugElementTest.queryAll(By.css('input'));
    const expectedMaxLength = 20;

    // Act
    testComponent.maxLength = expectedMaxLength;
    fixture.detectChanges();

    // Expect
    expect(inputElements[0].nativeElement.getAttribute('maxlength')).toBe(expectedMaxLength.toString());
    expect(inputElements[1].nativeElement.getAttribute('maxlength')).toBe(expectedMaxLength.toString());
  });

  it('should add clear icon on value update', fakeAsync(() => {
    // Assert
    const expectedOptions = {
      clearButton: true,
      charCounter: true
    };
    inputElementOne.focus();
    fixture.detectChanges();
    tick();

    // Act
    testComponent.options = expectedOptions;
    testComponent.amountFormControl.setValue('123456');
    fixture.detectChanges();
    discardPeriodicTasks();

    // Expect
    expect(inputElementOne.classList.contains('cdk-focused'))
      .toBe(true, 'input should have cdk-focused class');
    expect(inputElementOne.classList.contains('cdk-program-focused'))
      .toBe(true, 'input should have cdk-program-focused class');

    // Act
    focusMonitor.stopMonitoring(inputElementOne);
    fixture.detectChanges();
  }));

  it('should set an error', () => {
    // Assert
    const inputValue = '1 2 3 4 5 6 7 8 9 10 11 12 13';

    // Act
    testComponent.customErrors = new AtlasFormFieldErrors();
    testComponent.customErrors.setError('maxlength', 'Custom error message for maxLength');
    fixture.detectChanges();
    testComponent.amountFormControl.setValue(inputValue);
    fixture.detectChanges();

    // Expect
    expect(testComponent.amountFormControl.value).toEqual(inputValue);
    expect(testComponent.amountFormControl.getError('maxlength').actualLength).toBeGreaterThan(testComponent.amountFormControl.getError('maxlength').requiredLength);
    expect(testComponent.amountFormControl.status).toBe('INVALID');
  });

  it('should able to clear the entered text', fakeAsync(() => {
    // Assert
    const inputValue = '1 2 3 4 5';
    const expectedOptions = {
      clearButton: true,
      charCounter: true
    };

    inputElementOne.focus();
    fixture.detectChanges();
    tick();

    // Act
    testComponent.amountFormControl.setValue(inputValue);
    fixture.detectChanges();
    testComponent.options = expectedOptions;
    fixture.detectChanges();
    discardPeriodicTasks();

    // Expect
    expect(inputElementOne.classList.contains('cdk-focused'))
      .toBe(true, 'input should have cdk-focused class');
    expect(inputElementOne.classList.contains('cdk-program-focused'))
      .toBe(true, 'input should have cdk-program-focused class');
    expect(testComponent.atlasInput.showClearButton()).toBeTrue();
    expect(testComponent.amountFormControl.value).toBeDefined();

    // Assert to clear the text
    const buttonDebugElement = debugElementTest.query(By.css('button'));
    buttonDebugElement.nativeElement.click();
    fixture.detectChanges();
    tick(300);

    // Expect
    expect(testComponent.amountFormControl.value).toBeNull();


    // To remove the focus
    // Act
    focusMonitor.stopMonitoring(inputElementOne);
    fixture.detectChanges();

    // Expect
    expect(inputElementOne.classList.contains('cdk-focused'))
      .toBe(false, 'input should not have cdk-focused class');
    expect(inputElementOne.classList.contains('cdk-program-focused'))
      .toBe(false, 'input should not have cdk-program-focused class');
  }));

  it('should set masking config', async(() => {

    // Assert
    const maskingConfig = {
      mask: '+1(000-000-0000)'
    };

    // Act
    testComponent.telMaskConfig = maskingConfig;
    fixture.detectChanges();

    // Expect
    fixture.whenStable().then(() => {
      expect(testComponent.atlasInputTelephone.value).toBe('0123456789');
      expect(testComponent.atlasInputTelephone.maskedValue).toContain('+1(');
    });
  }));

});
