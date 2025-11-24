import { StyleSheet } from 'react-native';
import { CELL_HORIZONTAL_PADDING } from './EmotionCalendarScreen.constants';

export const styles = StyleSheet.create({
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
