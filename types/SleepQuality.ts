export interface ISleepQuality {
    value: number;
    getQualityLabel(): string;
}

export default class SleepQuality implements ISleepQuality {
    value: number;

    constructor(value: number) {
        if (value < 0 || value > 10) {
            throw new RangeError('Sleep quality must be between 0 and 10.');
        }
        this.value = value;
    }

    getQualityLabel(): string {
        if (this.value >= 9) return 'Excellent';
        if (this.value >= 7) return 'Good';
        if (this.value >= 5) return 'Fair';
        if (this.value >= 3) return 'Poor';
        return 'Very Poor';
    }
}