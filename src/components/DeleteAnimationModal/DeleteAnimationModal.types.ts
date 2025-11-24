export type DeleteAnimationModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  onAnimationComplete: () => void;
  onCancel?: () => void;
  durationMs?: number;
};
