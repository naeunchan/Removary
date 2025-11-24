import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';
import { formatDateYMD } from '@/utils/time';
import {
  APP_HEADER_TITLE,
  FIRST_VISIT_MESSAGE,
  LAST_VISIT_FALLBACK,
  LAST_VISIT_PROMPT,
  TODAY_VISIT_MESSAGE,
  VERSION_LABEL_PREFIX,
  YESTERDAY_VISIT_MESSAGE,
} from './AppHeader.constants';
import { styles } from './AppHeader.styles';
import type { AppHeaderProps } from './AppHeader.types';

const formatVisitMessage = (daysSinceLastVisit: number | null): string => {
  if (daysSinceLastVisit === null) {
    return FIRST_VISIT_MESSAGE;
  }
  if (daysSinceLastVisit === 0) {
    return TODAY_VISIT_MESSAGE;
  }
  if (daysSinceLastVisit === 1) {
    return YESTERDAY_VISIT_MESSAGE;
  }
  return `${daysSinceLastVisit}일 만에 돌아오셨어요.`;
};

export const AppHeader: React.FC<AppHeaderProps> = ({ lastVisitedAt, daysSinceLastVisit }) => {
  const lastVisitLabel = useMemo(() => {
    if (!lastVisitedAt) {
      return LAST_VISIT_PROMPT;
    }
    const formatted = formatDateYMD(lastVisitedAt);
    return formatted ? `마지막 접속: ${formatted}` : LAST_VISIT_FALLBACK;
  }, [lastVisitedAt]);

  const visitMessage = useMemo(
    () => formatVisitMessage(daysSinceLastVisit),
    [daysSinceLastVisit]
  );

  const versionLabel = useMemo(() => {
    const expoVersion = Constants.expoConfig?.version;
    if (expoVersion) {
      return `${VERSION_LABEL_PREFIX}${expoVersion}`;
    }

    const legacyManifest = (Constants as Record<string, unknown>).manifest as
      | { version?: string | null }
      | undefined;
    const manifestVersion = legacyManifest?.version ?? null;

    return manifestVersion ? `${VERSION_LABEL_PREFIX}${manifestVersion}` : null;
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{APP_HEADER_TITLE}</Text>
        {versionLabel ? <Text style={styles.versionTag}>{versionLabel}</Text> : null}
      </View>
      <Text style={styles.subtitle}>{visitMessage}</Text>
      <Text style={styles.lastVisit}>{lastVisitLabel}</Text>
    </View>
  );
};
