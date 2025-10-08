import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type EntrySummaryProps = {
  count: number;
};

export const EntrySummary: React.FC<EntrySummaryProps> = ({ count }) => (
  <View style={styles.listHeader}>
    <Text style={styles.sectionTitle}>나의 기록</Text>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#60a5fa',
    fontWeight: '600',
    fontSize: 14,
  },
});
