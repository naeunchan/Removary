import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AppHeader: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Removary</Text>
    <Text style={styles.subtitle}>
      30일 동안 기록을 간직하고, 시간이 지나면 조용히 보내 주세요.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  subtitle: {
    marginTop: 8,
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 22,
  },
});
