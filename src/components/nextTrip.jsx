import { useEffect, useState } from "react";
import useCurrentSchedule from "../effects/useCurrentSchedule";
import useRoute from "../effects/useRoute";
import Loading from "./loading";

export default function NextTrip(props) {
  const { trip } = props;
  const routeData = useRoute(trip.route);
  const schedules = useCurrentSchedule();
  const [nextTrip, setNextTrip] = useState({});

  useEffect(() => {
    if (routeData !== undefined && schedules !== undefined) {
      const currentDate = new Date();
      const selectedSchedule = Object.keys(routeData.trips).find(key => schedules.some(s => s === key));
      const trips = routeData.trips[selectedSchedule];

      // Filter trips by direction and including wanted stops
      const filteredTrips = trips.filter(routeTrip => {
        if (routeTrip.direction !== trip.direction) {
          return false
        }
        const departureStop = routeTrip.stops.find(s => s.stop_id === trip.departure);
        if (departureStop === undefined) {
          return false
        }

        const destinationStop = routeTrip.stops.find(s => s.stop_id === trip.destination);
        if (destinationStop === undefined) {
          return false
        }

        const departureTimeParts = departureStop.departure_time.split(":");

        // The date the train must arrive after.
        const departureTimeAsDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDay(),
          Number(departureTimeParts[0]),
          Number(departureTimeParts[1]),
          Number(departureTimeParts[3])
        );
        const adjustedDate = new Date(currentDate.getTime() + trip.travelTime * 60000);

        return adjustedDate.getTime() < departureTimeAsDate.getTime();
      });

      // Then sort by departure time
      filteredTrips.sort((a, b) => a.stops[0].departure_time.localeCompare(b.stops[0].departure_time));

      // Pick first trip that meets criteria.
      const nextTrip = filteredTrips[0];
      if (nextTrip === undefined) {
        setNextTrip({error: "No available trips."});
      } else {
        setNextTrip(buildNextStop(nextTrip));
      }
    }
  }, [routeData, schedules, trip])

  let body;
  if (nextTrip === {} || nextTrip.error) {
    body = <p>{nextTrip.error}</p>;
  } else {
    body = (
      <div>
        <p>{nextTrip.departureStopName} to {nextTrip.arrivalStopName}</p>
        <p>Leave at {nextTrip.leaveBy}</p>
        <p>There are no service alerts.</p>
      </div>
    );
  }

  return (
    <div>
      <Loading isLoading={nextTrip === {}}>
        <h1>Trip {trip.name}</h1>
        {body}
      </Loading>
    </div>
  );
}

function buildNextStop(nextTrip, trip) {
  const currentDate = new Date();
  const departureStop = nextTrip.stops.find(s => s.stop_id === trip.departure);
  const destinationStop = nextTrip.stops.find(s => s.stop_id === trip.destination);

  const departureTime = stopTimeToDate(currentDate, departureStop.departure_time);
  const arrivalTime = stopTimeToDate(currentDate, destinationStop.arrival_time);

  return {
    trip: nextTrip,
    departureStopName: departureStop.stop_name,
    departureTime,
    arrivalStopName: destinationStop.stop_name,
    arrivalTime,
    leaveBy: new Date(nextTrip.departureTime.getTime() - (trip.travelTime * 60000)),
  }
}

function stopTimeToDate(date, stopTime) {
  const stopTimeParts = stopTime.split(":");
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDay(),
    Number(stopTimeParts[0]),
    Number(stopTimeParts[1]),
    Number(stopTimeParts[3])
  );
}