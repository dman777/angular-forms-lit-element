import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'atlas-chip',
  templateUrl: './chip.component.html',
  exportAs: 'atlasChip'
})
export class AtlasChip implements AfterViewInit {

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

  @Output()
  click = new EventEmitter<MouseEvent>();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {
    this._rippleColor = 'rgba(0, 93, 111, 0.4)';
    this._imageRegex = '()*\.(?:jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG)';
  }

  // To emit the event when the chip is removed
  public chipRemoved(event: any): void {
    if (this.removed) {
      this.removed.emit(event);
    }
  }

  ngAfterViewInit() {
    // remove when https://github.com/angular/components/pull/19763 gets merged
    const el = this.element.nativeElement.firstElementChild;
    this.renderer.listen(el, 'click', (e) => this.click.emit(e));
  }
}
