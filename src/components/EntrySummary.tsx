import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EntrySummaryProps = {
	count: number;
};

export const EntrySummary: React.FC<EntrySummaryProps> = ({ count }) => (
	<View style={styles.listHeader}>
		<Text style={styles.sectionTitle}>Memories</Text>
		<Text style={styles.countText}>{count}개</Text>
	</View>
);

const styles = StyleSheet.create({
	listHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "600",
		color: "#1c1c1e",
	},
	countText: {
		color: "#6b7280",
		fontWeight: "500",
		fontSize: 15,
	},
});
