import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export function DateInput({
                              value,
                              onChange,
                              label,
                          }: {
    value: Date;
    onChange: (date: Date) => void;
    label?: string;
}) {
    const [show, setShow] = useState(false);

    return (
        <View style={{ marginVertical: 8 }}>
            {label && <Text style={{color: '#fff', marginBottom: 4}}>{label}</Text>}
            <Pressable
                onPress={() => setShow(true)}
                style={{
                    backgroundColor: '#222',
                    padding: 10,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#555',
                }}>
                <Text style={{ color: '#fff' }}>
                    {value.toLocaleDateString('en-GB')}
                </Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    mode="date"
                    value={value}
                    onChange={(_, selectedDate) => {
                        setShow(Platform.OS === 'ios');
                        if (selectedDate) onChange(selectedDate);
                    }}
                />
            )}
        </View>
    );
}
