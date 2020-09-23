import {
  Component,
  Input,
  Injector,
  Output,
  EventEmitter
} from '@angular/core';
import { AtlasErrorsHandlerService } from '@wellsky/atlas-ui/core';

@Component({
  selector: 'atlas-chip-list',
  templateUrl: './chip-list.component.html',
  exportAs: 'atlasChipList'
})

export class AtlasChipList {
  private _orientation: string;
  public errorsHandlerService: AtlasErrorsHandlerService;
  public _rippleColor: string;
  public _imageRegex: string;


  // Whether the user should be allowed to select multiple chips.
  @Input()
  multiple: boolean;

  // To indicate whether the chip list is selectable
  @Input()
  selectable: boolean;

  // To set the orientation of the chip list.
  @Input('aria-orientation')
  public set ariaOrientation(orientation: string) {
    try {
      this._orientation = orientation;
      if (orientation && (orientation !== 'horizontal') && (orientation !== 'vertical')) {
        this._orientation = 'horizontal';
        throw new Error(`Aria orientation for chips should be 'horizontal' or 'vertical'`);
      }
    } catch (error) {
      this.errorsHandlerService.handleError(error);
    }
  }
  public get ariaOrientation(): string {
    return this._orientation;
  }

  // To return the value selected call back
  @Output()
  removed = new EventEmitter<any>();

  constructor(private _injector: Injector) {
    this.errorsHandlerService = this._injector.get(AtlasErrorsHandlerService);
    this._rippleColor = 'rgba(0, 93, 111, 0.4)';
    this._imageRegex = '()*\.(?:jpg|jpeg|png|gif|svg|JPG|JPEG|PNG|GIF|SVG)';
  }

  // To emit the event when the chip is removed
  public chipRemoved(event: any): void {
    if (this.removed) {
      this.removed.emit(event);
    }
  }
}
