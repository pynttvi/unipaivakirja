export interface ITime {
    hour: number;   // 0 to 23
    minute: number; // 0 to 59
    toString(): string;
}

export class Time implements ITime {
    public readonly hour: number;
    public readonly minute: number;

    constructor(hour: number, minute: number) {
        if (!Time.isValidHour(hour)) {
            throw new Error(`Invalid hour: ${hour}. Must be between 0 and 23.`);
        }
        if (!Time.isValidMinute(minute)) {
            throw new Error(`Invalid minute: ${minute}. Must be between 0 and 59.`);
        }

        this.hour = hour;
        this.minute = minute;
    }

    static isValidHour(hour: number): boolean {
        return Number.isInteger(hour) && hour >= 0 && hour <= 23;
    }

    static isValidMinute(minute: number): boolean {
        return Number.isInteger(minute) && minute >= 0 && minute <= 59;
    }

    toString(): string {
        const h = this.hour.toString().padStart(2, '0');
        const m = this.minute.toString().padStart(2, '0');
        return `${h}:${m}`;
    }
}
