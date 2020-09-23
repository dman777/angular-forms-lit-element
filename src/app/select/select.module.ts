import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AtlasValidationService } from '@wellsky/atlas-ui/core';
import { AtlasSelect } from './select.component';


@NgModule({
    declarations: [
        AtlasSelect
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule
    ],
    exports: [
        AtlasSelect
    ],
    providers: [
        {
            provide: AtlasValidationService,
            useClass: AtlasValidationService
        }
    ]
})
export class AtlasSelectModule { }
