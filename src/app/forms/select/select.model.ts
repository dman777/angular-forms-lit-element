export class AtlasSelectOptionGroup {
    label: string;
    value: AtlasSelectOption[];
    disabled?: boolean;
}

export class AtlasSelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export declare type AtlasSelectDataSource = AtlasSelectOption | AtlasSelectOptionGroup;
