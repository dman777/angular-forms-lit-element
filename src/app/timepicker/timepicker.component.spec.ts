import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AtlasTime } from './time.model';
import { AtlasTimepickerTestComponent } from './testing/atlas-timepicker-test.component';
import { AtlasTimepickerModule } from './timepicker.module';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AtlasFormFieldErrors } from '@wellsky/atlas-ui/core';
import { ObserversModule } from '@angular/cdk/observers';


describe('AtlasTimepicker', () => {
  let componentAtlasTest: AtlasTimepickerTestComponent;
  let fixture: ComponentFixture<AtlasTimepickerTestComponent>;

  let debugElementTest: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtlasTimepickerTestComponent],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AtlasTimepickerModule,
        ObserversModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtlasTimepickerTestComponent);
    componentAtlasTest = fixture.componentInstance;

    debugElementTest = fixture.debugElement;

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(componentAtlasTest).toBeTruthy();
  });

  it('should change a label in container', async(() => {
    // Assert
    const matLabelElement = debugElementTest.queryAll(By.css('mat-label'));
    fixture.detectChanges();

    // Expect
    expect(matLabelElement[2].nativeElement.innerHTML).toEqual(componentAtlasTest.labelValue);

    // Act - changes the label value
    componentAtlasTest.changeLabel();
    fixture.detectChanges();

    // Expect
    fixture.whenStable().then(() => {
      expect(matLabelElement[2].nativeElement.innerHTML).toEqual(componentAtlasTest.labelValue);
    });
  }));

  describe('#valueChanges:', () => {

    it('should set null value', () => {
      // Assert happened in component's constructor by setting everything as null
      // Expect
      expect(componentAtlasTest.inputTimepicker.time.value).toBeNull('Expected the formControl to have be null');
      expect(componentAtlasTest.inputTempTimepicker.time.value).toBeNull('Expected the ngModel to have be null');
      expect(componentAtlasTest.dropdownTimepicker.dropdownTime.value)
        .toBeNull('Expected the formControl(dropdown) to have the value set');
      expect(componentAtlasTest.dropdownTempTimepicker.dropdownTime.value)
        .toBeNull('Expected the ngModel(dropdown) to have the value set');
    });

    it('should set AtlasTime value for input timepicker', fakeAsync(() => {
      // Assert
      let mockValue = new AtlasTime();
      mockValue = { hour: 17, minute: 0, second: 0 };
      const expectedValue = {
        meridian: 'PM',
        time: '05:00'
      };

      // Act

      componentAtlasTest.isMeridian = true;
      fixture.detectChanges();

      // Reactive Input
      componentAtlasTest.textInputFormControl.setValue(mockValue);
      fixture.detectChanges();

      // Template Driven
      componentAtlasTest.textInputTemplate = mockValue;
      fixture.detectChanges();

      tick();
      discardPeriodicTasks();

      expect(componentAtlasTest.inputTimepicker.time.value).toEqual(expectedValue.time, 'Expected the time formControl to have the value set');
      expect(componentAtlasTest.inputTimepicker.meridian.value).toEqual(expectedValue.meridian, 'Expected the meridian formControl to have the value set');
      expect(componentAtlasTest.inputTempTimepicker.time.value).toEqual(expectedValue.time, 'Expected the time ngModel to have the value set');
      expect(componentAtlasTest.inputTempTimepicker.meridian.value).toEqual(expectedValue.meridian, 'Expected the meridian ngModel to have the value set');
    }));

    it('should set AtlasTime value for dropdown timepicker', fakeAsync(() => {

      // Assert
      let mockValue = new AtlasTime();
      mockValue = { hour: 15, minute: 0, second: 0 };

      const expectedValue = '15:00';

      // Act
      // Reactive Input
      componentAtlasTest.dropdownFormControl.setValue(mockValue);
      fixture.detectChanges();
      // Template Driven
      componentAtlasTest.dropdownTemplate = mockValue;
      fixture.detectChanges();

      tick();
      discardPeriodicTasks();

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.dropdownTime.value).toEqual(expectedValue, 'Expected the formControl to have the value set');
      expect(componentAtlasTest.dropdownTempTimepicker.dropdownTime.value).toEqual(expectedValue, 'Expected the ngModel to have the value set');
    }));

    it('should give console error for the empty object', () => {
      // Assert
      const errorSpy = spyOn(console, 'error');

      // Act
      const mockValue = {};
      componentAtlasTest.textInputFormControl.setValue(mockValue);
      fixture.detectChanges();

      // Expect
      expect(console.error).toHaveBeenCalled();
      expect(errorSpy.calls.any()).toEqual(true);
    });

    it('should check form state with form control time', () => {
      // Assert
      let mockValue = new AtlasTime();
      mockValue = { hour: 15, minute: 0, second: 0 };

      // Expect
      expect(componentAtlasTest.time.valid).toBeTrue();

      // Act
      componentAtlasTest.time.setValue(mockValue);
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.time.valid).toBeTrue();
    });
  });

  describe('#properties:', () => {
    it('should make the input required', () => {

      const inputElements = debugElementTest.queryAll(By.css('input'));
      expect(componentAtlasTest.inputTimepicker.required).toBeFalse();

      // Act
      componentAtlasTest.required = true;
      fixture.detectChanges();

      // Expect
      expect(inputElements[0].nativeElement.attributes['required']).toBeDefined();
      expect(componentAtlasTest.inputTimepicker.required).toBeTrue();
    });

    it('should make the meridian dropdown required', () => {

      componentAtlasTest.isMeridian = true;

      const inputElements = debugElementTest.queryAll(By.css('.mat-select'));
      expect(componentAtlasTest.inputTimepicker.required).toBeFalse();

      // Act
      componentAtlasTest.required = true;
      fixture.detectChanges();

      // Expect
      expect(inputElements[0].nativeElement.attributes['required']).toBeDefined();
      expect(componentAtlasTest.inputTimepicker.required).toBeTrue();
    });

    it('should hide the required marker', () => {

      const inputElements = debugElementTest.queryAll(By.css('.mat-form-field'));
      expect(componentAtlasTest.inputTimepicker.hideRequiredMarker).toBeFalse();

      // Act
      componentAtlasTest.required = true;
      componentAtlasTest.hideRequiredMarker = true;
      fixture.detectChanges();

      // Expect
      expect(inputElements[0].nativeElement.attributes['ng-reflect-hide-required-marker']).toBeDefined();
      expect(componentAtlasTest.inputTimepicker.hideRequiredMarker).toBeTrue();
    });

    it('should set the label', () => {
      // Act
      const expectedLabel = `Time`;
      componentAtlasTest.label = expectedLabel;
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.inputTimepicker.label).toBe(expectedLabel);
    });
  });

  describe('#ngOnChanges():', () => {

    it('should set disabled for timepicker(input and dropdown): Reactive form', () => {
      // Expect
      expect(componentAtlasTest.textInputFormControl.disabled).toBeFalsy('Expected input timepicker(formControl) to be enabled');
      expect(componentAtlasTest.dropdownFormControl.disabled).toBeFalsy('Expected dropdown timepicker(formControl) to be enabled');

      // Act
      componentAtlasTest.textInputFormControl.disable();
      fixture.detectChanges();

      componentAtlasTest.dropdownFormControl.disable();
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.textInputFormControl.disabled).toBeTruthy('Expected input timepicker(formControl) to be disabled');
      expect(componentAtlasTest.dropdownFormControl.disabled).toBeTruthy('Expected dropdown timepicker(formControl) to be disabled');
    });

    it('should set disabled for timepicker(input and dropdown): Template Driven ', () => {
      // Act
      componentAtlasTest.disabled = true;
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.inputTempTimepicker.disabled).toBeTruthy('Expected input timepicker(ngModel) to be disabled');
      expect(componentAtlasTest.dropdownTempTimepicker.disabled).toBeTruthy('Expected dropdown timepicker(ngModel) to be disabled');

    });

    it('should set showSeconds for timepicker(input and dropdown)', fakeAsync(() => {

      // Assert
      let mockValue = new AtlasTime();
      mockValue = { hour: 17, minute: 0, second: 0 };

      // Act
      componentAtlasTest.textInputFormControl.setValue(mockValue);
      fixture.detectChanges();

      componentAtlasTest.dropdownFormControl.setValue(mockValue);
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.inputTimepicker.placeholder).toBe('hh:mm');
      expect(componentAtlasTest.dropdownTimepicker.placeholder).toBe('hh:mm');
      expect(componentAtlasTest.inputTimepicker.time.value).toBe('17:00');
      expect(componentAtlasTest.dropdownTimepicker.dropdownTime.value).toBe('17:00');

      // Act
      componentAtlasTest.showSeconds = true;
      fixture.detectChanges();

      tick();
      discardPeriodicTasks();

      // Expect
      expect(componentAtlasTest.inputTimepicker.placeholder).toBe('hh:mm:ss');
      expect(componentAtlasTest.dropdownTimepicker.placeholder).toBe('hh:mm:ss');
      expect(componentAtlasTest.inputTimepicker.time.value).toBe('17:00:00');
      expect(componentAtlasTest.dropdownTimepicker.dropdownTime.value).toBe('17:00:00');

    }));

    it('should set meridian', fakeAsync(() => {
      // Assert
      expect(componentAtlasTest.inputTimepicker.isMeridian).toBeFalse();
      expect(componentAtlasTest.dropdownTimepicker.isMeridian).toBeFalse();
      expect(componentAtlasTest.isMeridian).toBeFalse();

      // Act
      componentAtlasTest.isMeridian = true;
      fixture.detectChanges();

      tick();
      discardPeriodicTasks();

      // Expect
      expect(componentAtlasTest.inputTimepicker.isMeridian).toBeTrue();
      expect(componentAtlasTest.dropdownTimepicker.isMeridian).toBeTrue();
    }));

    it('should set hours, minutes and seconds stepper', () => {

      // Assert
      const mockHourStepper = 2;
      const mockMinsStepper = 30;
      const mockSecsStepper = 30;

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.hoursStepper).toEqual(componentAtlasTest.defaultHoursStepper);
      expect(componentAtlasTest.dropdownTimepicker.minsStepper).toEqual(componentAtlasTest.defaultMinsStepper);
      expect(componentAtlasTest.dropdownTimepicker.secsStepper).toEqual(componentAtlasTest.defaultSecsStepper);

      // Act
      componentAtlasTest.hoursStepper = mockHourStepper;
      fixture.detectChanges();
      componentAtlasTest.minsStepper = mockMinsStepper;
      fixture.detectChanges();
      componentAtlasTest.secsStepper = mockSecsStepper;
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.hoursStepper).toEqual(mockHourStepper);
      expect(componentAtlasTest.dropdownTimepicker.minsStepper).toEqual(mockMinsStepper);
      expect(componentAtlasTest.dropdownTimepicker.secsStepper).toEqual(mockSecsStepper);

      // Meridian is ON
      componentAtlasTest.isMeridian = true;
      fixture.detectChanges();

      // Act
      componentAtlasTest.hoursStepper = mockHourStepper;
      fixture.detectChanges();
      componentAtlasTest.minsStepper = mockMinsStepper;
      fixture.detectChanges();
      componentAtlasTest.secsStepper = mockSecsStepper;
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.hoursStepper).toEqual(mockHourStepper);
      expect(componentAtlasTest.dropdownTimepicker.minsStepper).toEqual(mockMinsStepper);
      expect(componentAtlasTest.dropdownTimepicker.secsStepper).toEqual(mockSecsStepper);

      // Assert
      const errorSpy = spyOn(console, 'error');

      // Act
      componentAtlasTest.hoursStepper = 90;
      fixture.detectChanges();
      componentAtlasTest.minsStepper = -1;
      fixture.detectChanges();
      componentAtlasTest.secsStepper = 100;
      fixture.detectChanges();

      // Expect
      expect(console.error).toHaveBeenCalled();
      expect(console.error).toBeTruthy(`Atlas.UI Timepicker(dropdown): hourStepper is not in valid hour range. Please enter the stepper value between
      1 to 12`);
      expect(console.error).toBeTruthy(`Atlas.UI Timepicker(dropdown): minsStepper is not in valid minute range. Please enter the stepper value between
      1 to 60`);
      expect(console.error).toBeTruthy(`Atlas.UI Timepicker(dropdown): secsStepper is not in valid second range. Please enter the stepper value between
      1 to 60`);
      expect(errorSpy.calls.any()).toEqual(true);
    });

    it('should set start and end time', () => {

      // Assert
      const mockStartTime = 3;
      const mockEndTime = 12;

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.startTime).toEqual(componentAtlasTest.defaultStartTime);
      expect(componentAtlasTest.dropdownTimepicker.endTime).toEqual(componentAtlasTest.defaultEndTime);

      // Act
      componentAtlasTest.startTime = mockStartTime;
      fixture.detectChanges();
      componentAtlasTest.endTime = mockEndTime;
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.startTime).toEqual(mockStartTime);
      expect(componentAtlasTest.dropdownTimepicker.endTime).toEqual(mockEndTime);

      // Meridian is ON
      componentAtlasTest.isMeridian = true;
      fixture.detectChanges();

      // Act
      componentAtlasTest.startTime = mockStartTime;
      fixture.detectChanges();
      componentAtlasTest.endTime = mockEndTime;
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.dropdownTimepicker.startTime).toEqual(mockStartTime);
      expect(componentAtlasTest.dropdownTimepicker.endTime).toEqual(mockEndTime);

      // Assert
      const errorSpy = spyOn(console, 'error');

      // Act
      componentAtlasTest.startTime = -1;
      fixture.detectChanges();
      componentAtlasTest.endTime = 30;
      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
      expect(console.error).toBeTruthy(`Atlas.UI Timepicker(dropdown): startTime is not in valid hour range. Please enter the value between
      0 to 24`);
      expect(console.error).toBeTruthy(`Atlas.UI Timepicker(dropdown): eTime is not in valid hour range. Please enter the value between
      0 to 24`);
      expect(errorSpy.calls.any()).toEqual(true);
    });

    it('should set an error', () => {

      // Assert
      let mockValue = new AtlasTime();
      mockValue = { hour: 8, minute: 0, second: 0 };

      // Act
      const customErrors = new AtlasFormFieldErrors();
      customErrors.setError('timeRangeError', 'Entered value should be between 06:00 to 10:00');
      componentAtlasTest.customErrors = customErrors;

      fixture.detectChanges();

      componentAtlasTest.textInputFormControl.setValue(mockValue);
      fixture.detectChanges();

      // Expect
      expect(componentAtlasTest.textInputFormControl.status).toBe('INVALID');
      expect((componentAtlasTest.textInputFormControl.errors).hasOwnProperty('timeRangeError')).toBeTruthy('Expected error to be present');
    });

    it('should set internal error when present', async(() => {
      // Assert
      let mockInvalidCustomValue = new AtlasTime();
      mockInvalidCustomValue = { hour: 8, minute: 0, second: 0 };

      // Act
      const customErrors = new AtlasFormFieldErrors();
      customErrors.setError('timeRangeError', 'Entered value should be between 06:00 to 10:00');
      componentAtlasTest.customErrors = customErrors;
      fixture.detectChanges();

      componentAtlasTest.time.setValue(mockInvalidCustomValue);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(componentAtlasTest.time.errors).hasOwnProperty('timeRangeError');
      });

      // Assert
      let mockInvalidHourValue = new AtlasTime();
      mockInvalidHourValue = { hour: 8, minute: 65, second: 0 };

      // Act
      componentAtlasTest.time.setValue(mockInvalidHourValue);
      fixture.detectChanges();

      // Expect
      fixture.whenStable().then(() => {
        expect(componentAtlasTest.time.errors).hasOwnProperty('minRangeError');
      });
    }));

    it('should remove errors when no errors on control', async(() => {
      // Assert
      let mockInvalidCustomValue = new AtlasTime();
      mockInvalidCustomValue = { hour: 8, minute: 0, second: 0 };

      // Act
      const customErrors = new AtlasFormFieldErrors();
      customErrors.setError('timeRangeError', 'Entered value should be between 06:00 to 10:00');
      componentAtlasTest.customErrors = customErrors;

      fixture.detectChanges();

      componentAtlasTest.time.setValue(mockInvalidCustomValue);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(componentAtlasTest.time.errors).hasOwnProperty('timeRangeError');
      });

      // Assert
      let mockValidHourValue = new AtlasTime();
      mockValidHourValue = { hour: 12, minute: 0, second: 0 };

      // Act
      componentAtlasTest.time.setValue(mockValidHourValue);
      fixture.detectChanges();

      // Expect
      fixture.whenStable().then(() => {
        expect(componentAtlasTest.time.valid).toBeTrue();
      });
    }));

  });

});

