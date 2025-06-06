import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {headers, lang, translations} from "@/utils/Translations";
import NightSleep from '@/types/NightSleep';
import {Time} from '@/types/Time';
import {DateInput} from '@/components/DateInput';
import {dateToString, stringToDate, timeToMinutes} from '@/utils/DateUtils';
import {exportToExcel} from "@/utils/XlsxExport";
import SleepQuality from "@/types/SleepQuality";
import {useFocusEffect} from '@react-navigation/native';

const generateMockSleepData = (count = 5): NightSleep[] => {
    const randomTime = (startHour = 0, endHour = 23) => ({
        hour: Math.floor(Math.random() * (endHour - startHour + 1)) + startHour,
        minute: Math.floor(Math.random() * 60),
    });

    return Array.from({length: count}).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
            date: dateToString(date),
            wentToBed: randomTime(21, 23),
            delayToFallAsleep: Math.floor(Math.random() * 30),
            wakingUpDuringSleep: Math.floor(Math.random() * 3),
            wokeUp: randomTime(5, 7),
            gotOutOfBed: randomTime(6, 8),
            wasAwakeInTheNight: Math.floor(Math.random() * 60),
            slept: randomTime(5, 8),
            timeInBed: randomTime(6, 9),
            sleepQuality: new SleepQuality(Math.floor(Math.random() * 10) + 1),
            napTime: Math.floor(Math.random() * 60),
            coffeeCups: Math.floor(Math.random() * 4),
            alcoholDoses: Math.floor(Math.random() * 3),
            notes: `Auto-entry #${i + 1}`,
        };
    });
};

const loadData = async () => {
    try {
        const fileUri = FileSystem.documentDirectory + 'sleep_log.txt';
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(fileUri);
            console.log("File content", content)
            const lines = content.trim().split('\n');
            const parsed: NightSleep[] = lines.map((line) => JSON.parse(line));
            return parsed.reverse()
        }
    } catch (e) {
        console.error('Failed to load file:', e);
    }
    return []
};

const deleteEntry = async (index: number) => {
    const fileUri = FileSystem.documentDirectory + 'sleep_log.txt';

    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        const lines = content.trim().split('\n');

        // Reverse to match order of display
        lines.reverse();
        lines.splice(index, 1); // remove the entry
        lines.reverse();

        const newContent = lines.join('\n') + '\n';
        await FileSystem.writeAsStringAsync(fileUri, newContent);

    } catch (err) {
        console.error('Failed to delete entry:', err);
    }
};
export default function SleepLogViewer() {
    const [entries, setEntries] = useState<NightSleep[]>([]);

    const today = new Date();
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(today.getDate() - 21);

    const [startDate, setStartDate] = useState<Date>(threeWeeksAgo);
    const [endDate, setEndDate] = useState<Date>(today);

    useEffect(() => {

        loadData().then((data) => setEntries(data));
        // const e = generateMockSleepData(30)
        // setEntries(e); // for testing
    }, []);


    useFocusEffect(
        useCallback(() => {
            loadData().then((data) => setEntries(data));
        }, [])
    );


    const formatTime = (t: Time) =>
        `${t.hour.toString().padStart(2, '0')}:${t.minute.toString().padStart(2, '0')}`;

    const average = (values: number[]) =>
        values.reduce((a, b) => a + b, 0) / values.length;

    const averageTime = (times: Time[]): Time => {
        const totalMinutes = times.reduce((sum, t) => sum + t.hour * 60 + t.minute, 0);
        const avgMinutes = Math.round(totalMinutes / times.length);
        return {
            hour: Math.floor(avgMinutes / 60),
            minute: avgMinutes % 60,
        };
    };

    const filtered = entries.filter((e) => {
        const d = stringToDate(e.date);
        return d instanceof Date && !isNaN(d.getTime()) && d >= startDate && d <= endDate;
    });

    return (
        <>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 8}}>
                <DateInput label={translations[lang]["fromDate"]} value={startDate} onChange={setStartDate}/>
                <DateInput label={translations[lang]["toDate"]} value={endDate} onChange={setEndDate}/>
                <TouchableOpacity onPress={() => exportToExcel(entries)} style={styles.exportButton}>
                    <Text style={styles.exportText}>{translations[lang].save} XLSX</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal style={styles.container}>
                <ScrollView>
                    <View style={styles.row}>
                        {headers.map((key) => (
                            <Text key={key} style={[styles.cell, styles.header]}>
                                {translations[lang][key]}
                            </Text>
                        ))}
                        <Text style={[styles.cell, styles.header]}>🗑</Text>
                    </View>
                    {filtered.map((item, idx) => (
                        <View key={idx} style={styles.row}>
                            <Text style={styles.cell}>{item.date}</Text>
                            <Text style={styles.cell}>{formatTime(item.wentToBed)}</Text>
                            <Text style={styles.cell}>{item.delayToFallAsleep}</Text>
                            <Text style={styles.cell}>{item.wakingUpDuringSleep}</Text>
                            <Text style={styles.cell}>{formatTime(item.wokeUp)}</Text>
                            <Text style={styles.cell}>{formatTime(item.gotOutOfBed)}</Text>
                            <Text style={styles.cell}>{item.wasAwakeInTheNight} min</Text>
                            <Text style={styles.cell}>{formatTime(item.slept)}</Text>
                            <Text style={styles.cell}>{formatTime(item.timeInBed)}</Text>
                            <Text style={styles.cell}>{item.sleepQuality.value}</Text>
                            <Text style={styles.cell}>{item.napTime}</Text>
                            <Text style={styles.cell}>{item.coffeeCups}</Text>
                            <Text style={styles.cell}>{item.alcoholDoses}</Text>
                            <Text style={styles.cell}>
                                {((timeToMinutes(item.slept) / timeToMinutes(item.timeInBed)) * 100).toFixed(1)}%
                            </Text>
                            <Text style={styles.cell}>{item.notes}</Text>
                            <TouchableOpacity
                                style={[styles.cell, {backgroundColor: '#220000'}]}
                                onPress={() => deleteEntry(idx).then(() => loadData().then((data) => setEntries(data)))
                                }
                            >
                                <Text style={{color: 'red', fontWeight: 'bold'}}>✖</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {filtered.length > 0 && (
                        <View style={styles.row}>
                            <Text style={[styles.cell, styles.header]}>{translations[lang]['average'] ?? 'Avg'}</Text>
                            <Text style={styles.cell}>{formatTime(averageTime(filtered.map(e => e.wentToBed)))}</Text>
                            <Text
                                style={styles.cell}>{average(filtered.map(e => e.delayToFallAsleep)).toFixed(1)}</Text>
                            <Text
                                style={styles.cell}>{average(filtered.map(e => e.wakingUpDuringSleep)).toFixed(1)}</Text>
                            <Text style={styles.cell}>{formatTime(averageTime(filtered.map(e => e.wokeUp)))}</Text>
                            <Text style={styles.cell}>{formatTime(averageTime(filtered.map(e => e.gotOutOfBed)))}</Text>
                            <Text
                                style={styles.cell}>{average(filtered.map(e => e.wasAwakeInTheNight)).toFixed(1)}</Text>
                            <Text style={styles.cell}>{formatTime(averageTime(filtered.map(e => e.slept)))}</Text>
                            <Text style={styles.cell}>{formatTime(averageTime(filtered.map(e => e.timeInBed)))}</Text>
                            <Text
                                style={styles.cell}>{average(filtered.map(e => e.sleepQuality.value)).toFixed(1)}</Text>
                            <Text style={styles.cell}>{average(filtered.map(e => e.napTime)).toFixed(1)}</Text>
                            <Text style={styles.cell}>{average(filtered.map(e => e.coffeeCups)).toFixed(1)}</Text>
                            <Text style={styles.cell}>{average(filtered.map(e => e.alcoholDoses)).toFixed(1)}</Text>
                            <Text style={styles.cell}>
                                {(
                                    average(
                                        filtered.map(e =>
                                            (timeToMinutes(e.slept) / timeToMinutes(e.timeInBed)) * 100
                                        )
                                    ).toFixed(1)
                                )}%
                            </Text>
                            <Text style={styles.cell}>–</Text>
                        </View>
                    )}
                </ScrollView>
            </ScrollView>
        </>
    );
}

const CELL_WIDTH = 100;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomColor: '#444',
        borderBottomWidth: 1,
    },
    cell: {
        width: CELL_WIDTH,
        paddingVertical: 10,
        paddingHorizontal: 6,
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: '#333',
    },
    header: {
        fontWeight: 'bold',
        color: '#0ff',
        backgroundColor: '#111',
    },
    exportButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        marginVertical: 12,
        alignItems: 'center',
    },
    exportText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
