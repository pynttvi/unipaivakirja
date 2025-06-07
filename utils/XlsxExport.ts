import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {timeToMinutes} from './DateUtils';
import {lang, translations} from './Translations';
import NightSleep from '@/types/NightSleep';

export const exportToExcel = async (data: NightSleep[]) => {
    if (data.length === 0) return;

    const average = (values: number[]) =>
        values.reduce((a, b) => a + b, 0) / values.length;

    const averageTime = (times: { hour: number; minute: number }[]) => {
        const totalMinutes = times.reduce((sum, t) => sum + t.hour * 60 + t.minute, 0);
        const avgMinutes = Math.round(totalMinutes / times.length);
        return {
            hour: Math.floor(avgMinutes / 60),
            minute: avgMinutes % 60,
        };
    };

    const formatTime = (t: { hour: number; minute: number }) =>
        `${t.hour.toString().padStart(2, '0')}:${t.minute.toString().padStart(2, '0')}`;

    // Prepare rows
    const rows = data.map((e) => ({
        [translations[lang].date]: e.date,
        [translations[lang].wentToBed]: formatTime(e.wentToBed),
        [translations[lang].delayToFallAsleep]: e.delayToFallAsleep,
        [translations[lang].wakingUpDuringSleep]: e.wakingUpDuringSleep,
        [translations[lang].wokeUp]: formatTime(e.wokeUp),
        [translations[lang].gotOutOfBed]: formatTime(e.gotOutOfBed),
        [translations[lang].wasAwakeInTheNight]: e.wasAwakeInTheNight,
        [translations[lang].slept]: formatTime(e.slept),
        [translations[lang].timeInBed]: formatTime(e.timeInBed),
        [translations[lang].sleepQuality]: e.sleepQuality.value,
        [translations[lang].daytimeVitality]: e.daytimeVitality.value,
        [translations[lang].napTime]: e.napTime,
        [translations[lang].coffeeCups]: e.coffeeCups,
        [translations[lang].alcoholDoses]: e.alcoholDoses,
        [translations[lang].sleepEfficiency]:
            ((timeToMinutes(e.slept) / timeToMinutes(e.timeInBed)) * 100).toFixed(1),
        [translations[lang].notes]: e.notes,
    }));

    // Add average row
    const avgRow: Record<string, string | number> = {
        [translations[lang].date]: translations[lang].average ?? 'Average',
        [translations[lang].wentToBed]: formatTime(averageTime(data.map(e => e.wentToBed))),
        [translations[lang].delayToFallAsleep]: average(data.map(e => e.delayToFallAsleep)).toFixed(1),
        [translations[lang].wakingUpDuringSleep]: average(data.map(e => e.wakingUpDuringSleep)).toFixed(1),
        [translations[lang].wokeUp]: formatTime(averageTime(data.map(e => e.wokeUp))),
        [translations[lang].gotOutOfBed]: formatTime(averageTime(data.map(e => e.gotOutOfBed))),
        [translations[lang].wasAwakeInTheNight]: average(data.map(e => e.wasAwakeInTheNight)).toFixed(1),
        [translations[lang].slept]: formatTime(averageTime(data.map(e => e.slept))),
        [translations[lang].timeInBed]: formatTime(averageTime(data.map(e => e.timeInBed))),
        [translations[lang].sleepQuality]: average(data.map(e => e.sleepQuality.value)).toFixed(1),
        [translations[lang].daytimeVitality]: average(data.map(e => e.daytimeVitality.value)).toFixed(1),
        [translations[lang].napTime]: average(data.map(e => e.napTime)).toFixed(1),
        [translations[lang].coffeeCups]: average(data.map(e => e.coffeeCups)).toFixed(1),
        [translations[lang].alcoholDoses]: average(data.map(e => e.alcoholDoses)).toFixed(1),
        [translations[lang].sleepEfficiency]: average(data.map(e =>
            (timeToMinutes(e.slept) / timeToMinutes(e.timeInBed)) * 100
        )).toFixed(1),
        [translations[lang].notes]: '–',
    };

    rows.push(avgRow);

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sleep Log');

    const fileUri = FileSystem.documentDirectory + 'sleep_log.xlsx';
    const wbout = XLSX.write(wb, {type: 'base64', bookType: 'xlsx'});

    await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
    } else {
        console.warn("Sharing not available on this device");
    }
};
