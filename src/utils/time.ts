export const DAY_MS = 24 * 60 * 60 * 1000;

export const formatRemainingTime = (expiresAt: number, currentTime: number = Date.now()): string => {
  const diff = expiresAt - currentTime;
  if (diff <= 0) {
    return '만료됨';
  }

  const totalMinutes = Math.floor(diff / (60 * 1000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}일 ${hours}시간 남음`;
  }
  if (hours > 0) {
    return `${hours}시간 ${minutes}분 남음`;
  }

  return `${minutes}분 남음`;
};
