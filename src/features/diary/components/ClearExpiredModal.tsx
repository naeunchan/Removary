import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type ClearExpiredModalProps = {
  visible: boolean;
  onCancel: () => void;
  onAnimationComplete: () => void;
};

export const ClearExpiredModal: React.FC<ClearExpiredModalProps> = ({
  visible,
  onCancel,
  onAnimationComplete,
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
      duration: 1600,
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
  }, [onAnimationComplete, progress, visible]);

  const paperStyle = {
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [1, 0.8, 0.2],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-25deg'],
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
      inputRange: [0, 0.8, 1],
      outputRange: [1, 1, 0],
    }),
  };

  const binLidStyle = {
    transform: [
      {
        rotate: progress.interpolate({
          inputRange: [0, 0.4, 1],
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
              <Text style={styles.modalTitle}>과거의 기억을 흘려보내요</Text>
              <Text style={styles.modalSubtitle}>Letting go of old memories...</Text>
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
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  paperSheet: {
    width: 140,
    height: 100,
    backgroundColor: '#fff8dc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  paperLine: {
    width: '70%',
    height: 8,
    backgroundColor: '#fde68a',
    borderRadius: 8,
    marginVertical: 6,
  },
  paperLineShort: {
    width: '50%',
  },
  binContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binLid: {
    width: 90,
    height: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  binBody: {
    width: 90,
    height: 90,
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  binContent: {
    width: '80%',
    height: '60%',
    backgroundColor: '#fcd34d',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binEmoji: {
    fontSize: 26,
  },
  cancelButton: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
});
