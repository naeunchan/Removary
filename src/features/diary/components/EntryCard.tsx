import React, { useCallback, useMemo, useRef } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { DiaryCategory } from '@/features/diary/types/diaryTypes';
import { formatDateYMD } from '@/utils/time';
import { CATEGORY_META } from './EntryCard.constants';
import { styles } from './EntryCard.styles';
import type { EntryCardProps, SwipeActionProps } from './EntryCard.types';

const LeftAction: React.FC<SwipeActionProps> = ({ width, progress, translation }) => {
  const fillStyle = useAnimatedStyle(() => {
    const openAmount = Math.min(width, Math.max(translation.value, 0));
    return {
      width: openAmount,
      opacity: Math.min(1, Math.max(progress.value, 0)),
    };
  });

  const iconStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(progress.value, 0)),
  }));

  return (
    <View style={[styles.actionContainer, styles.leftActionContainer, { width }]}>
      <Animated.View style={[styles.actionFill, styles.leftActionFill, fillStyle]} />
      <Animated.View style={[styles.actionIcon, styles.leftActionIcon, iconStyle]}>
        <MaterialIcons name="format-strikethrough" size={24} color="black" />
      </Animated.View>
    </View>
  );
};

const RightAction: React.FC<SwipeActionProps> = ({ width, progress, translation }) => {
  const fillStyle = useAnimatedStyle(() => {
    const openAmount = Math.min(width, Math.max(-translation.value, 0));
    return {
      width: openAmount,
      opacity: Math.min(1, Math.max(progress.value, 0)),
    };
  });

  const iconStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.max(progress.value, 0)),
  }));

  return (
    <View style={[styles.actionContainer, styles.rightActionContainer, { width }]}>
      <Animated.View style={[styles.actionFill, styles.rightActionFill, fillStyle]} />
      <Animated.View style={[styles.actionIcon, styles.rightActionIcon, iconStyle]}>
        <Ionicons name="trash" size={24} color="#fff" />
      </Animated.View>
    </View>
  );
};

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete, onToggleComplete }) => {
  const { width } = useWindowDimensions();
  const swipeThresholdRatio = 0.5;
  const effectiveWidth = Math.max(width * swipeThresholdRatio, 72);
  const swipeableRef = useRef<Swipeable>(null);

  const resolvedCategory = (entry.category ?? 'daily') as DiaryCategory;
  const categoryMeta = CATEGORY_META[resolvedCategory] ?? CATEGORY_META.daily;
  const createdAt = useMemo(() => new Date(entry.createdAt), [entry.createdAt]);
  const createdAtDate = useMemo(() => formatDateYMD(entry.createdAt), [entry.createdAt]);
  const titleStyle = useMemo(
    () => [styles.entryTitle, entry.isCompleted && styles.completedText],
    [entry.isCompleted],
  );
  const bodyStyle = useMemo(
    () => [styles.entryBody, entry.isCompleted && styles.completedBody],
    [entry.isCompleted],
  );
  const createdAtStyle = useMemo(
    () => [styles.createdAt, entry.isCompleted && styles.completedMeta],
    [entry.isCompleted],
  );

  const renderLeftActions = useCallback(
    (progress: SwipeActionProps['progress'], translation: SwipeActionProps['translation']) => (
      <LeftAction width={effectiveWidth} progress={progress} translation={translation} />
    ),
    [effectiveWidth],
  );

  const renderRightActions = useCallback(
    (progress: SwipeActionProps['progress'], translation: SwipeActionProps['translation']) => (
      <RightAction width={effectiveWidth} progress={progress} translation={translation} />
    ),
    [effectiveWidth],
  );

  const handleSwipeWillOpen = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left') {
        onDelete(entry.id, { skipConfirm: false });
        requestAnimationFrame(() => swipeableRef.current?.close());
      } else if (direction === 'right') {
        onToggleComplete(entry.id);
        requestAnimationFrame(() => swipeableRef.current?.close());
      }
    },
    [entry.id, onDelete, onToggleComplete],
  );

  return (
    <View style={styles.swipeContainer}>
      <Swipeable
        ref={swipeableRef}
        onSwipeableWillOpen={handleSwipeWillOpen}
        leftThreshold={effectiveWidth}
        rightThreshold={effectiveWidth}
        friction={1}
        overshootFriction={6}
        overshootLeft={false}
        overshootRight={false}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
      >
        <View style={styles.entryWrapper}>
          <View style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={[styles.categoryTag, { backgroundColor: categoryMeta.bg }]}>
                <Text style={[styles.categoryText, { color: categoryMeta.text }]}>
                  {categoryMeta.label}
                </Text>
              </View>
              <View style={styles.statusWrapper}>
                {entry.isCompleted ? (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#059669" />
                    <Text style={styles.completedLabel}>완료됨</Text>
                  </View>
                ) : (
                  <Text style={styles.activeLabel}>진행중</Text>
                )}
              </View>
            </View>
            <Text style={titleStyle}>{entry.title || '제목 없음'}</Text>
            <Text style={bodyStyle}>{entry.content}</Text>
            <View style={styles.entryFooter}>
              <Text style={createdAtStyle}>
                작성일 {createdAtDate}{' '}
                {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </Swipeable>
    </View>
  );
};
