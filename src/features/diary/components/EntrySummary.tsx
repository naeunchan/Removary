import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './EntrySummary.styles';
import type { EntrySummaryProps } from './EntrySummary.types';

export const EntrySummary: React.FC<EntrySummaryProps> = ({ count }) => (
	<View style={styles.listHeader}>
		<Text style={styles.sectionTitle}>Memories</Text>
		<Text style={styles.countText}>{count}개</Text>
	</View>
);
