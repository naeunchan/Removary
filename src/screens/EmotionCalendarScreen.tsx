import React, { useMemo, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DayEmotion } from '@/types/diaryModels';
import { useDiaryStore } from '@/store/diaryStore';

type EmotionCalendarScreenProps = {
  onClose: () => void;
};

type CalendarCell = {
  id: string;
  date: Date | null;
};

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const CELL_HORIZONTAL_PADDING = 10;
const CELL_GAP = 6;

const MOOD_META: Record<
  DayEmotion['mood'],
  {
    label: string;
    color: string;
  }
> = {
  very_good: { label: '아주 좋음', color: '#22c55e' },
  good: { label: '좋음', color: '#86efac' },
  neutral: { label: '보통', color: '#d1d5db' },
  bad: { label: '별로', color: '#fb923c' },
  very_bad: { label: '나쁨', color: '#ef4444' },
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const buildCalendarCells = (visibleDate: Date): CalendarCell[] => {
  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const cells: CalendarCell[] = [];
  for (let index = 0; index < totalCells; index += 1) {
    const dayNum = index - startWeekday + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ id: `pad-${index}`, date: null });
    } else {
      cells.push({ id: `day-${year}-${month}-${dayNum}`, date: new Date(year, month, dayNum) });
    }
  }
  return cells;
};

export const EmotionCalendarScreen: React.FC<EmotionCalendarScreenProps> = ({ onClose }) => {
  const dayEmotions = useDiaryStore((state) => state.dayEmotions);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const gridWidth = width - 40; // content paddingHorizontal: 20 on each side
  const innerGridWidth = gridWidth - CELL_HORIZONTAL_PADDING * 2;
  const cellSize = useMemo(() => (innerGridWidth - CELL_GAP * 6) / 7, [innerGridWidth]);

  const emotionMap = useMemo(() => {
    const map = new Map<string, DayEmotion['mood']>();
    dayEmotions.forEach((emotion) => {
      map.set(emotion.date, emotion.mood);
    });
    return map;
  }, [dayEmotions]);

  const calendarCells = useMemo(() => buildCalendarCells(visibleMonth), [visibleMonth]);
  const monthLabel = useMemo(
    () => visibleMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }),
    [visibleMonth],
  );

  const selectedMood = selectedDate ? emotionMap.get(selectedDate) : null;

  const handleChangeMonth = useCallback((delta: number) => {
    setVisibleMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return next;
    });
  }, []);

  const handleSelectDay = useCallback((date?: Date | null) => {
    if (!date) {
      return;
    }
    setSelectedDate(formatDate(date));
  }, []);

  const renderCell = useCallback(
    ({ item }: { item: CalendarCell }) => {
      if (!item.date) {
        return <View style={[styles.dayCellPlaceholder, { width: cellSize, height: cellSize }]} />;
      }

      const dateStr = formatDate(item.date);
      const mood = emotionMap.get(dateStr);
      const isSelected = selectedDate === dateStr;

      return (
        <TouchableOpacity
          style={[
            styles.dayCell,
            { width: cellSize, height: cellSize },
            isSelected && styles.dayCellSelected,
            mood && { backgroundColor: `${MOOD_META[mood].color}33` },
          ]}
          onPress={() => handleSelectDay(item.date)}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
            {item.date.getDate()}
          </Text>
          {mood && <View style={[styles.moodDot, { backgroundColor: MOOD_META[mood].color }]} />}
        </TouchableOpacity>
      );
    },
    [cellSize, emotionMap, handleSelectDay, selectedDate],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="chevron-back" size={20} color="#1c1c1e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>감정 캘린더</Text>
        <View style={styles.backButton} />
      </View>
      <View style={styles.content}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => handleChangeMonth(-1)}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={18} color="#1c1c1e" />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => handleChangeMonth(1)}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-forward" size={18} color="#1c1c1e" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekHeader}>
          {DAYS_OF_WEEK.map((day) => (
            <Text key={day} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          <FlatList
            data={calendarCells}
            renderItem={renderCell}
            keyExtractor={(item) => item.id}
            numColumns={7}
            columnWrapperStyle={{ gap: CELL_GAP }}
            contentContainerStyle={{ gap: CELL_GAP, paddingHorizontal: CELL_HORIZONTAL_PADDING }}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.legendContainer}>
          {Object.entries(MOOD_META).map(([key, meta]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: meta.color }]} />
              <Text style={styles.legendText}>{meta.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          {selectedDate && selectedMood ? (
            <>
              <Text style={styles.summaryDate}>{selectedDate}</Text>
              <Text style={styles.summaryMood}>
                오늘의 감정:{' '}
                <Text style={styles.summaryMoodHighlight}>{MOOD_META[selectedMood].label}</Text>
              </Text>
            </>
          ) : (
            <Text style={styles.summaryHint}>날짜를 선택하면 감정 기록을 확인할 수 있어요.</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: CELL_HORIZONTAL_PADDING,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  calendarGrid: {
    borderRadius: 18,
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  dayCellPlaceholder: {
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  dayCell: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 4,
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: '#fbbf24',
    backgroundColor: '#fff7ed',
  },
  dayText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#92400e',
  },
  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#4b5563',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  summaryMood: {
    fontSize: 14,
    color: '#4b5563',
  },
  summaryMoodHighlight: {
    color: '#92400e',
    fontWeight: '700',
  },
  summaryHint: {
    fontSize: 14,
    color: '#6b7280',
  },
});
