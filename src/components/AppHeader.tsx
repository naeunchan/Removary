import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDateYMD } from '@/utils/time';

type AppHeaderProps = {
  lastVisitedAt: number | null;
  daysSinceLastVisit: number | null;
};

const formatVisitMessage = (daysSinceLastVisit: number | null): string => {
  if (daysSinceLastVisit === null) {
    return '첫 방문을 환영해요. 오늘의 이야기를 남겨보세요.';
  }
  if (daysSinceLastVisit === 0) {
    return '오늘도 다시 찾아주셨네요!';
  }
  if (daysSinceLastVisit === 1) {
    return '하루 만에 돌아오셨어요.';
  }
  return `${daysSinceLastVisit}일 만에 돌아오셨어요.`;
};

export const AppHeader: React.FC<AppHeaderProps> = ({ lastVisitedAt, daysSinceLastVisit }) => {
  const lastVisitLabel = useMemo(() => {
    if (!lastVisitedAt) {
      return '지금 이 순간을 기록해 보세요.';
    }
    const formatted = formatDateYMD(lastVisitedAt);
    return formatted ? `마지막 접속: ${formatted}` : '마지막 접속 정보를 불러올 수 없어요.';
  }, [lastVisitedAt]);

  const visitMessage = useMemo(
    () => formatVisitMessage(daysSinceLastVisit),
    [daysSinceLastVisit]
  );

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Removary</Text>
      <Text style={styles.subtitle}>{visitMessage}</Text>
      <Text style={styles.lastVisit}>{lastVisitLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  subtitle: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 22,
  },
  lastVisit: {
    marginTop: 4,
    color: '#9ca3af',
    fontSize: 14,
  },
});
