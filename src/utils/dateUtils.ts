import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns';

export const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

export const parseDuration = (durationString: string) => {
  const [hours, minutes, seconds] = durationString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export const formatDate = (date: Date, pattern = 'MMMM d, yyyy h:mm a') =>
  format(date, pattern);

export const formatRelativeTime = (date: Date) =>
  formatDistanceToNow(date, { addSuffix: true });

export const getDiffInHoursAndMinutes = (startDate: Date, endDate: Date) => {
  const totalMinutes = differenceInMinutes(endDate, startDate);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};
