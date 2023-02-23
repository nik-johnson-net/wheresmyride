import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Trips() {
  const defaultTripName = window.localStorage.getItem("defaultTrip");
  
  const [trips, setTrips] = useState([]);
  const [defaultTrip, setDefaultTrip] = useState(defaultTripName);
  const generateTrips = useCallback(() => {
    let trips = [];
    const storage = window.localStorage;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key.startsWith("trip/")) {
        const trip = JSON.parse(storage.getItem(key));
        trips.push(trip);
      }
    }

    setDefaultTrip(window.localStorage.getItem("defaultTrip"));
    setTrips(trips);
  }, [setTrips]);

  const onDelete = useCallback((tripName) => {
    window.localStorage.removeItem(`trip/${tripName}`);
    generateTrips();
  }, [generateTrips]);

  const onDefault = useCallback((tripName) => {
    window.localStorage.setItem("defaultTrip", tripName);
    setDefaultTrip(tripName);
  }, []);

  useEffect(() => generateTrips(), [generateTrips]);

  const tripRows = trips.map(trip => (
    <tr key={trip.name}>
      <td><Link to={`/trip/${trip.name}`}>{trip.name}</Link></td>
      <td>{trip.route}</td>
      <td>
        <button type="button" className="btn btn-primary" disabled={trip.name === defaultTrip} onClick={() => onDefault(trip.name)}>Make Default</button>
        <button type="button" className="btn btn-danger" onClick={() => onDelete(trip.name)}>Delete</button>
      </td>
    </tr>
  ))
  return (<div>
    <h1>Trips</h1>
    <h4><Link to={`/newtrip`}>New Trip</Link></h4>
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Trip</th>
          <th scope="col">Route</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {tripRows}
      </tbody>
    </table>
  </div>);
}
