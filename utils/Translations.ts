// SleepKeys.ts (or wherever you define shared types)
export type SleepField =
    | 'date'
    | 'wentToBed'
    | 'delayToFallAsleep'
    | 'wakingUpDuringSleep'
    | 'wokeUp'
    | 'gotOutOfBed'
    | 'wasAwakeInTheNight'
    | 'slept'
    | 'timeInBed'
    | 'sleepQuality'
    | 'napTime'
    | 'coffeeCups'
    | 'alcoholDoses'
    | 'notes'
    | 'average'
    | 'fromDate'
    | 'toDate'
    | 'sleepEfficiency'
    ;


export type Language = 'en' | 'fi';

export const headers: SleepField[] = [
    'date',
    'wentToBed',
    'delayToFallAsleep',
    'wakingUpDuringSleep',
    'wokeUp',
    'gotOutOfBed',
    'wasAwakeInTheNight',
    'slept',
    'timeInBed',
    'sleepQuality',
    'napTime',
    'coffeeCups',
    'alcoholDoses',
    'sleepEfficiency',
    'notes'
];

export const lang: Language = 'fi';

export type QualityLabelKey = 'excellent' | 'good' | 'fair' | 'poor' | 'veryPoor';

export type TranslationKey =
    | SleepField
    | 'save'
    | 'average'
    | 'fromDate'
    | 'toDate'
    | 'sleepEfficiency'
    | QualityLabelKey;

export const translations: Record<Language, Record<TranslationKey, string>> = {
    en: {
        date: 'Date',
        wentToBed: 'Went to Bed',
        delayToFallAsleep: 'Delay',
        wakingUpDuringSleep: 'Wake Ups',
        wokeUp: 'Woke Up',
        gotOutOfBed: 'Got Up',
        wasAwakeInTheNight: 'Awake',
        slept: 'Slept',
        timeInBed: 'In Bed',
        sleepQuality: 'Quality',
        napTime: 'Nap',
        coffeeCups: 'Coffee',
        alcoholDoses: 'Alcohol',
        notes: 'Notes',
        save: 'Save',
        average: 'Avg',
        fromDate: 'Start date',
        toDate: 'End date',
        sleepEfficiency: 'Sleep efficiency',
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor',
        veryPoor: 'Very poor'

    },
    fi: {
        date: 'Päivämäärä',
        wentToBed: 'Nukkumaanmenoaika',
        delayToFallAsleep: 'Nukahtamisviive',
        wakingUpDuringSleep: 'Heräämiskerrat',
        wokeUp: 'Heräsin',
        gotOutOfBed: 'Nousin',
        wasAwakeInTheNight: 'Hereilläoloaika(min)',
        slept: 'Nukuin',
        timeInBed: 'Vuoteessaoloaika',
        sleepQuality: 'Unen laatu',
        napTime: 'Päiväunet(min)',
        coffeeCups: 'Kahvi',
        alcoholDoses: 'Alkoholi',
        notes: 'Muistiinpanot',
        save: 'Tallenna',
        average: 'Keskiarvo',
        fromDate: 'Alku',
        toDate: 'Loppu',
        sleepEfficiency: 'Unitehokkuus',
        excellent: 'Erinomainen',
        good: 'Hyvä',
        fair: 'Kehno',
        poor: 'Huono',
        veryPoor: 'Erittäin huono'
    },
};
