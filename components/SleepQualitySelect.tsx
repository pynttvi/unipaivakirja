import React from 'react';
import { Picker } from '@react-native-picker/picker'; // Or other compatible Picker
import { View, Text, StyleSheet } from 'react-native';
import {lang, translations} from "@/utils/Translations";

type SleepQualitySelectProps = {
    value: number;
    onChange: (value: number) => void;
    label?: string;
};

export const SleepQualitySelect: React.FC<SleepQualitySelectProps> = ({ value, onChange, label }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    dropdownIconColor="#ffffff"
                    style={styles.picker}
                    itemStyle={{ color: '#ffffff' }} // ensures text is white
                >
                    {Array.from({ length: 11 }, (_, i) => (
                        <Picker.Item key={i} label={`${i} - ${getLabel(i)}`} value={i} />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

const getLabel = (val: number): string => {
    if (val >= 9) return translations[lang].excellent;
    if (val >= 7) return translations[lang].good;
    if (val >= 5) return translations[lang].fair;
    if (val >= 3) return translations[lang].poor;
    return translations[lang].veryPoor;
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        color: '#ffffff',
        fontWeight: '600',
        marginBottom: 5,
    },
    pickerWrapper: {
        backgroundColor: '#222222',
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        color: '#ffffff',
        backgroundColor: '#222222',
        height: 50,
        width: '100%',
    },
});
