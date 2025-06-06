import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

import NightSleep from '@/types/NightSleep';
import {DateInput} from '@/components/DateInput';
import {TimeInput} from '@/components/TimeInput';
import * as FileSystem from 'expo-file-system';

import {lang, translations} from "@/utils/Translations";
import SleepQuality from "@/types/SleepQuality";
import {SleepQualitySelect} from "@/components/SleepQualitySelect";
import {dateToString, stringToDate} from "@/utils/DateUtils";
import {useNavigation} from '@react-navigation/native';


const steps: (keyof typeof translations.en)[] = [
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
    'notes',
];

const isSleptDefault = (val: { hour: number; minute: number }) =>
    val.hour === 7 && val.minute === 0;

function getSuggestedSlept(data: NightSleep): { hour: number; minute: number } {
    const toMinutes = (time: { hour: number; minute: number }) => time.hour * 60 + time.minute;

    const wentToBedMin = toMinutes(data.wentToBed);
    const wokeUpMin = toMinutes(data.wokeUp);
    const inBedDuration = wokeUpMin >= wentToBedMin
        ? wokeUpMin - wentToBedMin
        : (24 * 60 - wentToBedMin) + wokeUpMin; // handle overnight

    const adjusted = inBedDuration - data.delayToFallAsleep - data.wasAwakeInTheNight;

    const hours = Math.floor(adjusted / 60);
    const minutes = adjusted % 60;

    return {hour: hours, minute: minutes};
}

function getSuggestedTimeInBed(data: NightSleep): { hour: number; minute: number } {
    const toMinutes = (time: { hour: number; minute: number }) => time.hour * 60 + time.minute;

    const wentToBedMin = toMinutes(data.wentToBed);
    const gotOutMin = toMinutes(data.gotOutOfBed);

    const duration = gotOutMin >= wentToBedMin
        ? gotOutMin - wentToBedMin
        : (24 * 60 - wentToBedMin) + gotOutMin;

    return {
        hour: Math.floor(duration / 60),
        minute: duration % 60,
    };
}

export function NightSleepWizard() {
    const navigation = useNavigation();

    const [step, setStep] = useState(0);
    const [data, setData] = useState<NightSleep>({
        date: dateToString(new Date()),
        wentToBed: {hour: 0, minute: 30},
        delayToFallAsleep: 15,
        wakingUpDuringSleep: 0,
        wokeUp: {hour: 6, minute: 30},
        gotOutOfBed: {hour: 7, minute: 0},
        wasAwakeInTheNight: 0,
        slept: {hour: 7, minute: 0},
        timeInBed: {hour: 6, minute: 0},
        sleepQuality: new SleepQuality(7),
        napTime: 0,
        coffeeCups: 1,
        alcoholDoses: 0,
        notes: '',
    });

    const isLastStep = step === steps.length - 1;

    const next = () => {
        if (!isLastStep) setStep((prev) => prev + 1);
        else console.log('Submit data:', data);
    };

    const back = () => {
        if (step > 0) setStep((prev) => prev - 1);
    };

    const updateField = (field: keyof NightSleep, value: any) => {
        if (field === "sleepQuality") {
            setData({...data, [field]: new SleepQuality(value)});
            return
        }
        setData({...data, [field]: value});
    };

    const renderNumberInput = (field: keyof NightSleep, placeholder: string) => (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={String(data[field])}
            onChangeText={(text) => updateField(field, Number(text))}
        />
    );

    const renderStep = () => {
        const currentKey = steps[step];

        switch (currentKey) {
            case 'date':
                return (
                    <DateInput
                        value={stringToDate(data.date)}
                        onChange={(date) =>
                            updateField('date', dateToString(date))
                        }
                    />
                );
            case 'slept': {
                if (isSleptDefault(data.slept)) {
                    const suggested = getSuggestedSlept(data);
                    updateField('slept', suggested);
                }

                return (
                    <TimeInput
                        value={data.slept}
                        onChange={(val) => updateField('slept', val)}
                    />
                );
            }
            case 'wentToBed':
            case 'wokeUp':
            case 'gotOutOfBed':
                return (
                    <TimeInput
                        value={data[currentKey]}
                        onChange={(val) => updateField(currentKey, val)}
                    />)
            case 'timeInBed': {
                if (data.timeInBed.hour === 9 && data.timeInBed.minute === 0) {
                    const suggested = getSuggestedTimeInBed(data);
                    updateField('timeInBed', suggested);
                }

                return (
                    <TimeInput
                        value={data.timeInBed}
                        onChange={(val) => updateField('timeInBed', val)}
                    />
                );
            }
            case 'sleepQuality':
                return (
                    <SleepQualitySelect
                        value={data.sleepQuality.value}
                        onChange={(val) => updateField('sleepQuality', val)}
                        label={translations[lang].sleepQuality}
                    />
                );
            case 'delayToFallAsleep':
            case 'wakingUpDuringSleep':
            case 'wasAwakeInTheNight':
            case 'napTime':
            case 'coffeeCups':
            case 'alcoholDoses':
                return renderNumberInput(currentKey, translations[lang][currentKey]);
            case 'notes':
                return (
                    <>
                        <TextInput
                            style={[styles.input, {height: 100}]}
                            multiline
                            placeholder={translations[lang].notes}
                            placeholderTextColor="#888"
                            value={data.notes}
                            onChangeText={(text) => updateField('notes', text)}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveText}>{translations[lang].save ?? 'Save'}</Text>
                        </TouchableOpacity>
                    </>
                );
            default:
                return null;
        }
    };


    const handleGesture = (event: any) => {
        const {translationX, state} = event.nativeEvent;

        if (state === State.END) {
            if (translationX < -50) {
                next();
            } else if (translationX > 50) {
                back();
            }
        }
    };

    const handleSave = async () => {
        try {
            const fileUri = FileSystem.documentDirectory + 'sleep_log.txt';
            const entry = JSON.stringify(data) + '\n';

            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
                const existing = await FileSystem.readAsStringAsync(fileUri);
                await FileSystem.writeAsStringAsync(fileUri, existing + entry); // ✅ Append
            } else {
                await FileSystem.writeAsStringAsync(fileUri, entry); // ✅ First write
            }

            console.log('Saved to:', fileUri);

            // ✅ 1. Reset the form before navigating
            setStep(0);
            setData({
                date: dateToString(new Date()),
                wentToBed: {hour: 0, minute: 30},
                delayToFallAsleep: 15,
                wakingUpDuringSleep: 0,
                wokeUp: {hour: 6, minute: 30},
                gotOutOfBed: {hour: 7, minute: 0},
                wasAwakeInTheNight: 0,
                slept: {hour: 7, minute: 0},
                timeInBed: {hour: 9, minute: 0},
                sleepQuality: new SleepQuality(7),
                napTime: 0,
                coffeeCups: 0,
                alcoholDoses: 0,
                notes: '',
            });

            // ✅ 2. Navigate back
            navigation.goBack();

        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save.');
        }
    };

    return (
        <PanGestureHandler onHandlerStateChange={handleGesture}>
            <View style={styles.gestureArea}>
                <View style={styles.container}>
                    <View style={styles.wizardCard}>
                        <Text style={styles.title}>{translations[lang][steps[step]]}</Text>
                        {renderStep()}
                    </View>
                </View>
            </View>
        </PanGestureHandler>

    );
}

const styles = StyleSheet.create({
    gestureArea: {
        flex: 1,
        width: '100%',
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#fff',
        textAlign: 'center', // ✅ optional, for center-aligned title
    },
    input: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginVertical: 12,
        minWidth: '100%',
        fontSize: 20,
        color: '#fff',
        backgroundColor: '#111',
        textAlign: 'center', // ✅ this centers the value inside the input
    },
    wizardCard: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        gap: 16,
    },
    saveButton: {
        backgroundColor: '#007aff',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
