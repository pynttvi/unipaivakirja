import * as FileSystem from 'expo-file-system';

export const fixFormattedSleepLog = async () => {
    const fileUri = FileSystem.documentDirectory + 'sleep_log.txt';

    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        const lines = content.split('\n');
        const buffer: string[] = [];
        const fixedLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            buffer.push(line);
            const maybeJson = buffer.join('\n');

            try {
                const obj = JSON.parse(maybeJson);
                fixedLines.push(JSON.stringify(obj)); // compact version
                buffer.length = 0; // clear buffer
            } catch {
                // not yet valid JSON, keep accumulating
            }
        }

        if (buffer.length > 0) {
            console.warn("❗ Incomplete JSON object at end of file, skipped:", buffer.join('\n'));
        }

        const fixedContent = fixedLines.join('\n') + '\n';
        console.log("Fixed content", fixedContent)
        await FileSystem.writeAsStringAsync(fileUri, fixedContent);
        console.log("✅ sleep_log.txt fixed and saved as compact line-based JSON.");
    } catch (err) {
        console.error('❌ Error fixing sleep_log.txt:', err);
    }
};


export const cleanupSleepLogFile = async () => {
    const fileUri = FileSystem.documentDirectory + 'sleep_log.txt';

    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        const lines = content.trim().split('\n');

        const validLines: string[] = [];
        let skipped = 0;

        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                validLines.push(JSON.stringify(parsed)); // compact format
            } catch {
                skipped++;
            }
        }

        const cleanedContent = validLines.join('\n') + '\n';
        await FileSystem.writeAsStringAsync(fileUri, cleanedContent);
        console.log(`✅ Cleaned sleep_log.txt: kept ${validLines.length}, removed ${skipped} malformed line(s).`);
    } catch (err) {
        console.error('❌ Failed to clean sleep_log.txt:', err);
    }
};
