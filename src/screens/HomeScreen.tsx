import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/features/diary/components/AppHeader';
import { EntryForm } from '@/features/diary/components/EntryForm';
import { EntryList } from '@/features/diary/components/EntryList';
import { EntrySummary } from '@/features/diary/components/EntrySummary';
import { useDiaryEntries } from '@/features/diary/hooks/useDiaryEntries';
import { useDiaryStore } from '@/features/diary/store/useDiaryStore';
import type {
  DiaryCategory,
  DiaryEntry as LegacyDiaryEntry,
} from '@/features/diary/types/diaryTypes';
import { DeleteAnimationModal } from '@/components/DeleteAnimationModal';
import { DAY_MS } from '@/utils/time';
import { RETENTION_DAYS } from '@/constants/diary';
import {
  BATCH_DELETE_TITLE,
  CALENDAR_BUTTON_LABEL,
  EXPIRED_BANNER_TITLE,
  SINGLE_DELETE_SUBTITLE,
  SINGLE_DELETE_TITLE,
  getBatchDeleteSubtitle,
} from './HomeScreen.constants';
import { styles } from './HomeScreen.styles';
import type { DeleteModalConfig, HomeScreenProps, StoreEntryMapper } from './HomeScreen.types';

const deriveTitleFromContent = (content: string) => {
  const firstLine = content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0);
  return firstLine ?? '제목 없음';
};

const mapStoreEntryToLegacy: StoreEntryMapper = (entry) => ({
  id: entry.id,
  title: entry.title || deriveTitleFromContent(entry.content),
  content: entry.content,
  createdAt: entry.createdAt,
  isCompleted: entry.isCompleted,
  category: entry.category,
});

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
  const [deleteModalConfig, setDeleteModalConfig] = useState<DeleteModalConfig | null>(null);
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
  }, [clearStoreExpiredEntries, expiredLegacyEntries, expiredStoreEntries, handleDelete]);

  const handleOpenClearModal = useCallback(() => {
    if (!showExpiredBanner || deleteModalConfig) {
      return;
    }
    setDeleteModalConfig({ type: 'batch' });
  }, [deleteModalConfig, showExpiredBanner]);

  const handleRequestDelete = useCallback(
    (id: string, options?: { skipConfirm?: boolean }) => {
      if (options?.skipConfirm) {
        handleDelete(id, { skipConfirm: true });
        return;
      }
      if (deleteModalConfig) {
        return;
      }
      setDeleteModalConfig({ type: 'single', entryId: id });
    },
    [deleteModalConfig, handleDelete],
  );

  const handleDeleteModalCancel = useCallback(() => {
    setDeleteModalConfig(null);
  }, []);

  const handleDeleteModalComplete = useCallback(() => {
    if (!deleteModalConfig) {
      return;
    }
    if (deleteModalConfig.type === 'single') {
      handleDelete(deleteModalConfig.entryId, { skipConfirm: true });
    } else {
      handlePerformClearExpired();
    }
    setDeleteModalConfig(null);
  }, [deleteModalConfig, handleDelete, handlePerformClearExpired]);

  const modalTitle = deleteModalConfig?.type === 'batch' ? BATCH_DELETE_TITLE : SINGLE_DELETE_TITLE;
  const modalSubtitle =
    deleteModalConfig?.type === 'batch'
      ? getBatchDeleteSubtitle(RETENTION_DAYS)
      : SINGLE_DELETE_SUBTITLE;

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
          keyboardDismissMode="on-drag"
        >
          <AppHeader lastVisitedAt={lastVisitedAt} daysSinceLastVisit={daysSinceLastVisit} />
          <EntryForm draft={draft} onChange={handleChange} onSubmit={handleSubmit} />
          {showExpiredBanner && (
            <View style={styles.expiredBanner}>
              <View style={styles.bannerTextWrapper}>
                <Text style={styles.bannerTitle}>{EXPIRED_BANNER_TITLE}</Text>
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
            <Text style={styles.calendarButtonText}>{CALENDAR_BUTTON_LABEL}</Text>
          </TouchableOpacity>
          <EntryList
            entries={resolvedEntries}
            isLoading={isLoading}
            onDelete={handleRequestDelete}
            onToggleComplete={handleToggleComplete}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <DeleteAnimationModal
        visible={deleteModalConfig !== null}
        title={modalTitle}
        subtitle={modalSubtitle}
        onCancel={deleteModalConfig ? handleDeleteModalCancel : undefined}
        onAnimationComplete={handleDeleteModalComplete}
      />
    </SafeAreaView>
  );
};
