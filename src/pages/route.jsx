import useRoute from '../effects/useRoute';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Route() {
    let { route } = useParams();
    // console.log("load")

    const [serviceSchedule, setServiceSchedule] = useState('')
    const [direction, setDirection] = useState(0);
    const [fromStop, setFromStop] = useState(0);
    const [toStop, setToStop] = useState(0);
    const [directionStops, setDirectionStops] = useState([]);
    const routeData = useRoute(route);

    useEffect(() => {
        if (routeData !== undefined) {
            if (serviceSchedule === '') {
                let schedule = Object.keys(routeData.trips)[0];
                if (schedule !== undefined) {
                    setServiceSchedule(schedule);
                }
            }
            if (routeData.trips[serviceSchedule] !== undefined) {
                let directionTrips = routeData.trips[serviceSchedule].filter(trip => trip.direction === direction);
                if (directionTrips.length > 0) {
                    let directionStops = directionTrips[0].stops;
                    setDirectionStops(directionStops);
                }
            }
        }
    }, [routeData, direction, serviceSchedule, setDirectionStops, setServiceSchedule]);
        
    useEffect(() => {
        if (directionStops !== undefined && directionStops.length > 1) {
            setFromStop(directionStops[0].stop_id);
            setToStop(directionStops[directionStops.length - 1].stop_id);
        }
    }, [setFromStop, setToStop, directionStops]);

    if (routeData === null || serviceSchedule === '') {
        return (<div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>)
    }

    let scheduleSelect = Object.keys(routeData.trips).map((sched) =>
        <option key={sched} value={sched}>{sched}</option>
    );

    let trips = routeData.trips[serviceSchedule]
        .filter((trip) => trip.direction === direction)
        .sort((a, b) => a.stops[0].departure_time.localeCompare(b.stops[0].departure_time))
        .flatMap((trip) => {
        let start = trip.stops.find((x) => x.stop_id === fromStop)
        let stop = trip.stops.find((x) => x.stop_id === toStop)
        if (start === undefined || stop === undefined) {
            console.log("undefined start/stop point")
            return undefined;
        }
        return (<tr key={trip.id}>
            <td>{trip.id}</td>
            <td>{trip.headsign}</td>
            <td>{start.departure_time}</td>
            <td>{stop.arrival_time}</td>
        </tr>);
    });

    let formStops = directionStops.map(stop =>
        <option key={stop.stop_id} value={stop.stop_id}>{stop.stop_name}</option>
    );
    
    return (
        <div>
            <h1>{routeData.short_name}: {routeData.long_name}</h1>
            <p>{routeData.desc}</p>
            <form className="form-inline">
                <select className="custom-select" value={serviceSchedule} onChange={e => setServiceSchedule(e.target.value)}>
                    {scheduleSelect}
                </select>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" checked={direction === 0} name="radioDirection" id="radioDirectionInbound" value="0" onChange={e => setDirection(0)} />
                    <label className="form-check-label" htmlFor="inlineRadio1">Inbound</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio"checked={direction === 1}  name="radioDirection" id="radioDirectionOutbound" value="1" onChange={e => setDirection(1)} />
                    <label className="form-check-label" htmlFor="inlineRadio2">Outbound</label>
                </div>
                <div className="form-check form-check-inline">
                    <label className="form-check-label" htmlFor="inlineRadio2">From</label>
                    <select className="custom-select" value={fromStop} onChange={e => setFromStop(Number(e.target.value))}>
                        {formStops}
                    </select>
                </div>
                <div className="form-check form-check-inline">
                    <label className="form-check-label" htmlFor="inlineRadio2">To</label>
                    <select className="custom-select" value={toStop} onChange={e => setToStop(Number(e.target.value))}>
                        {formStops}
                    </select>
                </div>
            </form>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Trip ID</th>
                        <th scope="col">Headsign</th>
                        <th scope="col">Depart</th>
                        <th scope="col">Arrive</th>
                    </tr>
                </thead>
                <tbody>
                    {trips}
                </tbody>
            </table>
        </div>
    );
}
