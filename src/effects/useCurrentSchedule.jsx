import { useState, useEffect } from 'react';
import useSchedule from './useSchedule';

export default function useCurrentSchedule() {
  const schedules = useSchedule();
  const [scheduleList, setScheduleList] = useState();

  useEffect(() => {
    if (schedules !== undefined) {
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay();

      const currentSchedules = schedules.services.filter(sched => {
        switch (dayOfWeek) {
          case 0:
            return sched.sunday === 1;
          case 1:
            return sched.monday === 1;
          case 2:
            return sched.tuesday === 1;
          case 3:
            return sched.wednesday === 1;
          case 4:
            return sched.thursday === 1;
          case 5:
            return sched.friday === 1;
          case 6:
            return sched.saturday === 1;
          default:
            return false;
        }
      }).map(sched => sched.id);

      setScheduleList(currentSchedules);
    }
  }, [schedules]);
  return scheduleList;
}
