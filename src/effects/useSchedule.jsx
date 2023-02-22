import { useState, useEffect } from 'react';

export default function useSchedule() {
    const [scheduleList, setScheduleList] = useState();

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/routes/schedules.json`).then((resp) => {
            if (!resp.ok) {
                console.log("failed to get rtd schedules", resp.statusText)
                setScheduleList({})
            } else {
                resp.json().then((data) => setScheduleList(data))
            }
        })
    }, [setScheduleList]);
    return scheduleList;
}
