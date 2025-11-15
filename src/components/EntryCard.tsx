import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import type { DiaryCategory } from "@/types/diaryModels";
import { DiaryEntry } from "@/types/diary";
import { formatDateYMD } from "@/utils/time";

type EntryCardProps = {
	entry: DiaryEntry;
	onDelete: (id: string, options?: { skipConfirm?: boolean }) => void;
	onToggleComplete: (id: string) => void;
};

type SwipeActionProps = {
	width: number;
	progress: SharedValue<number>;
	translation: SharedValue<number>;
};

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

const CATEGORY_META: Record<
	DiaryCategory,
	{
		label: string;
		bg: string;
		text: string;
	}
> = {
	work: { label: "일", bg: "#e0f2fe", text: "#0369a1" },
	relationship: { label: "관계", bg: "#fee2e2", text: "#b91c1c" },
	daily: { label: "일상", bg: "#ede9fe", text: "#5b21b6" },
	study: { label: "공부", bg: "#dcfce7", text: "#15803d" },
	etc: { label: "기타", bg: "#f3f4f6", text: "#4b5563" },
};

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete, onToggleComplete }) => {
	const { width } = useWindowDimensions();
	const swipeThresholdRatio = 0.5;
	const effectiveWidth = Math.max(width * swipeThresholdRatio, 72);
	const swipeableRef = useRef<any>(null);

	const resolvedCategory = (entry.category ?? "daily") as DiaryCategory;
	const categoryMeta = CATEGORY_META[resolvedCategory] ?? CATEGORY_META.daily;
	const createdAt = useMemo(() => new Date(entry.createdAt), [entry.createdAt]);
	const createdAtDate = useMemo(() => formatDateYMD(entry.createdAt), [entry.createdAt]);
	const containerStyle = styles.entryCard;
	const titleStyle = useMemo(() => [styles.entryTitle, entry.isCompleted && styles.completedText], [entry.isCompleted]);
	const bodyStyle = useMemo(() => [styles.entryBody, entry.isCompleted && styles.completedBody], [entry.isCompleted]);
	const createdAtStyle = useMemo(() => [styles.createdAt, entry.isCompleted && styles.completedMeta], [entry.isCompleted]);

	const renderLeftActions = useCallback(
		(progress: SharedValue<number>, translation: SharedValue<number>) => <LeftAction width={effectiveWidth} progress={progress} translation={translation} />,
		[effectiveWidth],
	);

	const renderRightActions = useCallback(
		(progress: SharedValue<number>, translation: SharedValue<number>) => <RightAction width={effectiveWidth} progress={progress} translation={translation} />,
		[effectiveWidth],
	);

	const handleSwipeWillOpen = useCallback(
		(direction: "left" | "right") => {
			if (direction === "right") {
				onToggleComplete(entry.id);
				requestAnimationFrame(() => swipeableRef.current?.close());
			} else if (direction === "left") {
				onDelete(entry.id);
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
					<View style={containerStyle}>
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
						<Text style={titleStyle}>{entry.title || "제목 없음"}</Text>
						<Text style={bodyStyle}>{entry.content}</Text>
						<View style={styles.entryFooter}>
							<Text style={createdAtStyle}>
								작성일 {createdAtDate} {createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
					</View>
				</View>
			</Swipeable>
		</View>
	);
};

const styles = StyleSheet.create({
	swipeContainer: {
		marginVertical: 8,
	},
	entryWrapper: {
		marginHorizontal: 4,
	},
	entryCard: {
		backgroundColor: "#fff",
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 10,
		elevation: 2,
	},
	entryTitle: {
		flex: 1,
		fontSize: 19,
		fontWeight: "600",
		color: "#1c1c1e",
		marginBottom: 6,
	},
	entryBody: {
		fontSize: 16,
		lineHeight: 22,
		color: "#3c3c43",
		marginBottom: 18,
	},
	entryFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	createdAt: {
		fontSize: 13,
		color: "#9ca3af",
	},
	entryHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	categoryTag: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
	},
	categoryText: {
		fontSize: 12,
		fontWeight: "600",
	},
	statusWrapper: {
		flexDirection: "row",
		alignItems: "center",
	},
	completedBadge: {
		flexDirection: "row",
		alignItems: "center",
	},
	completedLabel: {
		fontSize: 12,
		color: "#065f46",
		fontWeight: "600",
		marginLeft: 4,
	},
	activeLabel: {
		fontSize: 12,
		color: "#4b5563",
		fontWeight: "500",
	},
	completedText: {
		textDecorationLine: "line-through",
		color: "#9ca3af",
	},
	completedBody: {
		textDecorationLine: "line-through",
		color: "#9ca3af",
	},
	completedMeta: {
		color: "#9ca3af",
	},
	actionContainer: {
		height: "100%",
		overflow: "hidden",
		justifyContent: "center",
	},
	leftActionContainer: {
		alignItems: "flex-start",
	},
	rightActionContainer: {
		alignItems: "flex-end",
	},
	actionFill: {
		position: "absolute",
		top: 0,
		bottom: 0,
	},
	actionIcon: {
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 18,
	},
	leftActionIcon: {
		alignSelf: "flex-start",
	},
	rightActionIcon: {
		alignSelf: "flex-end",
	},
	leftActionFill: {
		left: 0,
		borderTopLeftRadius: 18,
		borderBottomLeftRadius: 18,
		backgroundColor: "#34d399",
	},
	rightActionFill: {
		right: 0,
		borderTopRightRadius: 18,
		borderBottomRightRadius: 18,
		backgroundColor: "#ef4444",
	},
});
