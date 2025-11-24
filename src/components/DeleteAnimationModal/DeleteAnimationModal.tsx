import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { DEFAULT_DELETE_ANIMATION_DURATION } from './DeleteAnimationModal.constants';
import { styles } from './DeleteAnimationModal.styles';
import type { DeleteAnimationModalProps } from './DeleteAnimationModal.types';

export const DeleteAnimationModal: React.FC<DeleteAnimationModalProps> = ({
  visible,
  title,
  subtitle,
  onAnimationComplete,
  onCancel,
  durationMs = DEFAULT_DELETE_ANIMATION_DURATION,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    let isCancelled = false;
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: durationMs,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished && !isCancelled) {
        onAnimationComplete();
      }
    });

    return () => {
      isCancelled = true;
      animation.stop();
      progress.setValue(0);
    };
  }, [durationMs, onAnimationComplete, progress, visible]);

  const paperStyle = {
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [1, 0.85, 0.2],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-20deg'],
        }),
      },
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60],
        }),
      },
    ],
    opacity: progress.interpolate({
      inputRange: [0, 0.85, 1],
      outputRange: [1, 1, 0],
    }),
  };

  const binLidStyle = {
    transform: [
      {
        rotate: progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['0deg', '12deg', '0deg'],
        }),
      },
    ],
  };

  const binContentStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0, 0.8, 1],
    }),
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalSubtitle}>{subtitle}</Text>
              <View style={styles.animationContainer}>
                <Animated.View style={[styles.paperSheet, paperStyle]}>
                  <View style={styles.paperLine} />
                  <View style={[styles.paperLine, styles.paperLineShort]} />
                  <View style={styles.paperLine} />
                </Animated.View>
                <View style={styles.binContainer}>
                  <Animated.View style={[styles.binLid, binLidStyle]} />
                  <View style={styles.binBody}>
                    <Animated.View style={[styles.binContent, binContentStyle]}>
                      <Text style={styles.binEmoji}>🌀</Text>
                    </Animated.View>
                  </View>
                </View>
              </View>
              {onCancel && (
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
