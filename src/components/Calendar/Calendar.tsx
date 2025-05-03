import { useState, useEffect } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { calendarData as mockData } from '@/utils/mockData';
import api from '@/utils/axiosInstance';
import { formatDate } from '@/utils/dateUtils';

type CalendarProps = {
  username: string;
};

const Calendar = ({ username }: CalendarProps) => {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calendarTheme = {
    light: ['#ebedf0', '#bbdefb', '#64b5f6', '#1976d2', '#0d47a1'],
    dark: ['#ebedf0', '#bbdefb', '#64b5f6', '#1976d2', '#0d47a1'],
    //   Purple ['#ebedf0', '#d1c4e9', '#9575cd', '#512da8', '#311b92'],
    //   Green ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  };

  useEffect(() => {
    const fetchCalendarData = async () => {
      const currentDate = formatDate(new Date().toISOString(), 'yyyy-MM-dd');
      const yesterdayDate = formatDate(
        new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        'yyyy-MM-dd'
      );
      const oneYearAgoDate = formatDate(
        new Date(
          new Date().setFullYear(new Date().getFullYear() - 1)
        ).toISOString(),
        'yyyy-MM-dd'
      );
      try {
        setLoading(true);
        // setTimeout(() => {
        //   setCalendarData(
        //     setMinCalendarRange(mockData, '2024-01-01', '2024-12-31')
        //   );
        //   setLoading(false);
        // }, 1000);
        const response = await api.get(
          `/api/users/${username}/daily-exercise-count?startDate=${oneYearAgoDate}&endDate=${currentDate}`
        );
        setCalendarData(
          addStartAndEndDate(response.data, oneYearAgoDate, yesterdayDate)
        );
      } catch (error) {
        console.error('Failed to load calendar data', error);
        setError('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [username]);

  function addStartAndEndDate(data, startDate, endDate) {
    const startObject = { date: startDate, count: 0, level: 0 };

    const updatedData = [startObject, ...data];

    const existingEndObject = data.find((item) => item.date === endDate);

    if (existingEndObject) {
      updatedData.push({ ...existingEndObject });
    } else {
      updatedData.push({ date: endDate, count: 0, level: 0 });
    }

    return updatedData;
  }

  if (error)
    return (
      <Grid container sx={{ width: '100%' }} justifyContent="center">
        <Typography>{error}</Typography>
      </Grid>
    );
  return (
    <Grid container sx={{ width: '100%' }} justifyContent="center">
      <ActivityCalendar
        data={calendarData}
        theme={calendarTheme}
        maxLevel={4}
        loading={loading}
        weekStart={1}
        labels={{
          totalCount: '{{count}} activities in the last year',
        }}
        renderBlock={(block, activity) => (
          <Tooltip
            key={activity.date}
            title={`${activity.count} exercises on ${activity.date}`}
          >
            {block}
          </Tooltip>
        )}
        renderColorLegend={(block, level) => (
          <Tooltip key={`legend-${level}`} title={`Level ${level}`}>
            {block}
          </Tooltip>
        )}
      />
    </Grid>
  );
};

export default Calendar;
