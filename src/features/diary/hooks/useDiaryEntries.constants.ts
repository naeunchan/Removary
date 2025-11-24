import { RETENTION_DAYS } from '@/constants/diary';
import { DAY_MS } from '@/utils/time';

export const RETENTION_WINDOW_MS = RETENTION_DAYS * DAY_MS;
export const EMPTY_ENTRY = { title: '', content: '' };
