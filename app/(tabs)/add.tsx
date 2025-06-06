import {StyleSheet} from 'react-native';
import {NightSleepWizard} from '@/components/NightSleepWizard';

export default function TabTwoScreen() {
    return (
        <NightSleepWizard/>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
});
