import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';
import { AtlasChipList } from './chip-list.component';
import { AtlasChip } from './chip.component';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [AtlasChipList, AtlasChip],
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatRippleModule
  ],
  providers: [
    {
      provide: AtlasErrorsHandlerService,
      useValue: AtlasErrorsHandlerService
    }
  ],
  exports: [AtlasChipList, AtlasChip]
})
export class AtlasChipsModule { }
