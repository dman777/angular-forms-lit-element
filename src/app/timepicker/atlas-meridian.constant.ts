import { InjectionToken } from '@angular/core';

export const ATLAS_MERIDIAN = new InjectionToken<AtlasMeridian>('AtlasMeridian');

export class AtlasMeridian {
    AM: string;
    PM: string;
}

export const MERIDIAN: AtlasMeridian = {
    AM: 'AM',
    PM: 'PM'
};
