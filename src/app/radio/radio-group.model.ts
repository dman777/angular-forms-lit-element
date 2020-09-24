import { AtlasRadioButtonConfig } from './radio-button.model';

export class AtlasRadioGroupConfig {
    disabled?: boolean;
    labelPosition?: 'before' | 'after';
    name?: string;
    required?: boolean;
    selected?: AtlasRadioButtonConfig;
    value?: any;
}
