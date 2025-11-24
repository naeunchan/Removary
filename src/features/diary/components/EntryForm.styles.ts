import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  dateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1c1c1e',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textarea: {
    minHeight: 140,
    paddingTop: 16,
  },
  metaSection: {
    marginBottom: 14,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
  chipText: {
    fontSize: 13,
    color: '#6b7280',
  },
  chipTextSelected: {
    color: '#92400e',
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f5f5f7',
    marginHorizontal: 4,
  },
  moodButtonSelected: {
    backgroundColor: '#ecfccb',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  moodLabelSelected: {
    color: '#15803d',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#fdd663',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#fcd34d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 2,
  },
  submitText: {
    color: '#1c1c1e',
    fontWeight: '600',
    fontSize: 16,
  },
});
