import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  swipeContainer: {
    marginVertical: 8,
  },
  entryWrapper: {
    marginHorizontal: 4,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  entryTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  entryBody: {
    fontSize: 16,
    lineHeight: 22,
    color: '#3c3c43',
    marginBottom: 18,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 13,
    color: '#9ca3af',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  completedLabel: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600',
  },
  activeLabel: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  completedBody: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  completedMeta: {
    color: '#9ca3af',
  },
  actionContainer: {
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  leftActionContainer: {
    alignItems: 'flex-start',
  },
  rightActionContainer: {
    alignItems: 'flex-end',
  },
  actionFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  leftActionIcon: {
    alignSelf: 'flex-start',
  },
  rightActionIcon: {
    alignSelf: 'flex-end',
  },
  leftActionFill: {
    left: 0,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    backgroundColor: '#34d399',
  },
  rightActionFill: {
    right: 0,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: '#ef4444',
  },
});
