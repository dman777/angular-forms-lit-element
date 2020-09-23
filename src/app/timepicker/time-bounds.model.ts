import { AtlasMinMax } from '@wellsky/atlas-ui/core';

export class AtlasTimeBounds {
    HOUR: AtlasMinMax;
    MINUTE: AtlasMinMax;
    SECOND: AtlasMinMax;

    // TODO: Min Max Range for each time component
    constructor(meridian: boolean) {
        // Hour bounds
        if (meridian) {
            this.HOUR = new AtlasMinMax(1, 12);
        } else {
            this.HOUR = new AtlasMinMax(0, 23);
        }

        // Minute bounds
        this.MINUTE = new AtlasMinMax(0, 59);

        // Second bounds
        this.SECOND = new AtlasMinMax(0, 59);
    }
}
