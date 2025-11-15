import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { ClearExpiredModal } from '@/components/ClearExpiredModal';
import { EntryForm } from '@/components/EntryForm';
import { EntryList } from '@/components/EntryList';
import { EntrySummary } from '@/components/EntrySummary';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { useDiaryStore } from '@/store/diaryStore';
import type { DiaryCategory, DiaryEntry as StoreDiaryEntry } from '@/types/diaryModels';
import type { DiaryEntry as LegacyDiaryEntry } from '@/types/diary';
import { DAY_MS } from '@/utils/time';
import { RETENTION_DAYS } from '@/constants/diary';

const deriveTitleFromContent = (content: string) => {
  const firstLine = content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  return firstLine ?? '제목 없음';
};

const mapStoreEntryToLegacy = (entry: StoreDiaryEntry): LegacyDiaryEntry => ({
  id: entry.id,
  title: entry.title || deriveTitleFromContent(entry.content),
  content: entry.content,
  createdAt: entry.createdAt,
  isCompleted: entry.isCompleted,
  category: entry.category,
});

type HomeScreenProps = {
  onOpenEmotionCalendar?: () => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenEmotionCalendar }) => {
  const {
    entries: legacyEntries,
    draft,
    isLoading,
    lastVisitedAt,
    daysSinceLastVisit,
    now,
    handleChange,
    handleSubmit,
    handleDelete,
    handleToggleComplete,
  } = useDiaryEntries();
  const storeEntries = useDiaryStore((state) => state.entries);
  const clearStoreExpiredEntries = useDiaryStore((state) => state.clearExpiredEntries);
  const [selectedCategory] = useState<DiaryCategory | 'all'>('all');
  const [isClearModalVisible, setClearModalVisible] = useState(false);
  const retentionWindowMs = RETENTION_DAYS * DAY_MS;

  const filteredStoreEntries = useMemo(() => {
    if (selectedCategory === 'all') {
      return storeEntries;
    }
    return storeEntries.filter((entry) => entry.category === selectedCategory);
  }, [storeEntries, selectedCategory]);

  const resolvedEntries = useMemo<LegacyDiaryEntry[]>(() => {
    if (!filteredStoreEntries.length) {
      return legacyEntries;
    }
    return filteredStoreEntries.map(mapStoreEntryToLegacy);
  }, [filteredStoreEntries, legacyEntries]);

  // Track expiry separately for legacy hook data and store data so bulk clear removes both.
  const expiredLegacyEntries = useMemo(() => {
    if (!legacyEntries.length) {
      return [];
    }
    return legacyEntries.filter((entry) => {
      const createdAtMs = Date.parse(entry.createdAt);
      if (Number.isNaN(createdAtMs)) {
        return false;
      }
      return now - createdAtMs >= retentionWindowMs;
    });
  }, [legacyEntries, now, retentionWindowMs]);

  const expiredStoreEntries = useMemo(() => {
    if (!storeEntries.length) {
      return [];
    }
    return storeEntries.filter((entry) => {
      const expiresAtMs = Date.parse(entry.expiresAt);
      if (!Number.isNaN(expiresAtMs)) {
        return expiresAtMs <= now;
      }
      const createdAtMs = Date.parse(entry.createdAt);
      if (Number.isNaN(createdAtMs)) {
        return false;
      }
      return now - createdAtMs >= retentionWindowMs;
    });
  }, [now, retentionWindowMs, storeEntries]);

  const expiredCount = expiredLegacyEntries.length + expiredStoreEntries.length;
  const showExpiredBanner = expiredCount > 0;

  const handleOpenCalendarPress = useCallback(() => {
    onOpenEmotionCalendar?.();
  }, [onOpenEmotionCalendar]);

  const handlePerformClearExpired = useCallback(() => {
    expiredLegacyEntries.forEach((entry) => {
      handleDelete(entry.id, { skipConfirm: true });
    });
    if (expiredStoreEntries.length > 0) {
      clearStoreExpiredEntries();
    }
    setClearModalVisible(false);
  }, [clearStoreExpiredEntries, expiredLegacyEntries, expiredStoreEntries, handleDelete]);

  const handleCancelClearModal = useCallback(() => {
    setClearModalVisible(false);
  }, []);

  const handleOpenClearModal = useCallback(() => {
    if (!showExpiredBanner) {
      return;
    }
    setClearModalVisible(true);
  }, [showExpiredBanner]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AppHeader lastVisitedAt={lastVisitedAt} daysSinceLastVisit={daysSinceLastVisit} />
          <EntryForm draft={draft} onChange={handleChange} onSubmit={handleSubmit} />
          {showExpiredBanner && (
            <View style={styles.expiredBanner}>
              <View style={styles.bannerTextWrapper}>
                <Text style={styles.bannerTitle}>기한이 지난 메모</Text>
                <Text style={styles.bannerDescription}>
                  {RETENTION_DAYS}일 이상 지난 메모가 {expiredCount}개 있어요.
                </Text>
              </View>
              <TouchableOpacity style={styles.bannerButton} onPress={handleOpenClearModal}>
                <Text style={styles.bannerButtonText}>지금 정리</Text>
              </TouchableOpacity>
            </View>
          )}
          <EntrySummary count={resolvedEntries.length} />
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={handleOpenCalendarPress}
            accessibilityRole="button"
          >
            <Text style={styles.calendarButtonText}>감정 캘린더 보기</Text>
          </TouchableOpacity>
          <EntryList
            entries={resolvedEntries}
            isLoading={isLoading}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <ClearExpiredModal
        visible={isClearModalVisible}
        onCancel={handleCancelClearModal}
        onAnimationComplete={handlePerformClearExpired}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingVertical: 28,
  },
  calendarButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  calendarButtonText: {
    color: '#0369a1',
    fontWeight: '600',
    fontSize: 13,
  },
  expiredBanner: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 13,
    color: '#b45309',
  },
  bannerButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
  },
  bannerButtonText: {
    color: '#1c1c1e',
    fontWeight: '600',
    fontSize: 13,
  },
});
