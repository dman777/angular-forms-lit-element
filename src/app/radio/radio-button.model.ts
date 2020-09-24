import { AtlasRadioGroupConfig } from './radio-group.model';
import { ThemePalette } from '@angular/material/core';
export class AtlasRadioButtonConfig {
    ariaDescribedby?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    checked?: boolean;
    color?: ThemePalette;
    disableRipple?: boolean;
    disabled?: boolean;
    id?: string;
    labelPosition?: 'before' | 'after';
    name?: string;
    required?: boolean;
    value?: any;
    inputId?: string;
    radioGroup?: AtlasRadioGroupConfig;
}
