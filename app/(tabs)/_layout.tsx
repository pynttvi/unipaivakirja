import {Tabs} from 'expo-router';
import React from 'react';
import {Platform, SafeAreaView} from 'react-native';

import {HapticTab} from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarBackground: TabBarBackground,
                    tabBarStyle: Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: 'absolute',
                        },
                        default: {},
                    }),
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Päiväkirja',
                        tabBarIcon: ({color}) => <FontAwesome name="list" size={28} color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="add"
                    options={{
                        title: 'Lisää',
                        tabBarIcon: ({color}) => <MaterialIcons name="add" size={28} color={color}/>,
                    }}
                />
            </Tabs>
    );

}
