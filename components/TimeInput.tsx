import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export function TimeInput({
                              label,
                              value,
                              onChange,
                          }: {
    label?: string;
    value: { hour: number; minute: number };
    onChange: (time: { hour: number; minute: number }) => void;
}) {
    const [show, setShow] = useState(false);

    const date = new Date();
    date.setHours(value.hour, value.minute);

    return (
        <View style={{ marginVertical: 8 }}>
            {label && <Text style={{ color: '#fff', marginBottom: 4 }}>{label}</Text>}
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
                    {String(value.hour).padStart(2, '0')}:
                    {String(value.minute).padStart(2, '0')}
                </Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    mode="time"
                    value={date}
                    onChange={(_, selectedDate) => {
                        setShow(Platform.OS === 'ios');
                        if (selectedDate) {
                            onChange({
                                hour: selectedDate.getHours(),
                                minute: selectedDate.getMinutes(),
                            });
                        }
                    }}
                />
            )}
        </View>
    );
}
