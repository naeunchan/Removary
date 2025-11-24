import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
