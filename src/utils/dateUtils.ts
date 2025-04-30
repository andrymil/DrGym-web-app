import {
  format,
  parseISO,
  formatDistanceToNow,
  differenceInMinutes,
} from 'date-fns';

export const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

export const parseDuration = (durationString) => {
  const [hours, minutes, seconds] = durationString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const formatDate = (date, pattern = 'MMMM d, yyyy h:mm a') =>
  format(parseISO(date), pattern);

export const formatRelativeTime = (date) =>
  formatDistanceToNow(parseISO(date), { addSuffix: true });

export const getDiffInHoursAndMinutes = (startISO, endISO) => {
  const startDate = parseISO(startISO);
  const endDate = parseISO(endISO);

  const totalMinutes = differenceInMinutes(endDate, startDate);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};
