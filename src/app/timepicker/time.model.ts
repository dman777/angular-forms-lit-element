export class AtlasTime {
    hour: number;
    minute: number;
    second: number;

    constructor(date?: Date) {
        if (date) {
            this.hour = date.getHours();
            this.minute = date.getMinutes();
            this.second = date.getSeconds();
        } else {
            this.hour = null;
            this.minute = null;
            this.second = null;
        }
    }
}
