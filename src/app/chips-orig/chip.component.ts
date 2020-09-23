import { Component, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'atlas-chip',
  templateUrl: './chip.component.html',
  exportAs: 'atlasChip'
})
export class AtlasChip {

  public _rippleColor: string;
  public _imageRegex: string;

  // Theme color palette for the component.
  @Input()
  color: ThemePalette;

  // Whether ripples are disabled.
  @Input()
  disableRipple: boolean;

  // Whether the component is disabled.
  @Input()
  disabled: boolean;

  // To set the avatar image
  @Input()
  image: string;

  // Whether the chips can be removed
  @Input()
  removable: boolean;

  // Whether or not the chip is selectable
  @Input()
  selectable: boolean;

  // Whether the chip is selected.
  @Input()
  selected: boolean;

  // To represent the value of the chip
  @Input()
  value: any;

  // To return the value selected call back
  @Output()
  removed = new EventEmitter<any>();

  // To emit the event when the chip is removed
  public chipRemoved(event: any): void {
    if (this.removed) {
      this.removed.emit(event);
    }
  }

  constructor(private element: ElementRef) {
    this._rippleColor = 'rgba(0, 93, 111, 0.4)';
    this._imageRegex = '()*\.(?:jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG)';
  }

}
