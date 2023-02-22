import { useCallback, useEffect, useState } from "react";
import useRoute from "../effects/useRoute";
import Loading from "./loading"; 


function buildStopList(routeData, direction) {
  return Object.entries(routeData.trips).flatMap(([_, trips]) =>
      trips.filter(trip => trip.direction === direction).map(trip => trip.stops)
    )[0];
};

export default function NewTripRouteForms(props) {
  const { route, direction, departure, destination, setFormState } = props;
  const [formStopOptions, setFormStopOptions] = useState();
  const routeData = useRoute(route);
  
  const updateDirection = useCallback((direction) => {
    setFormState((formState) => {
      return { ...formState, direction };
    });
  }, [setFormState]);

  const updateTravelTime = useCallback((travelTime) => {
    setFormState((formState) => {
      return { ...formState, travelTime };
    });
  }, [setFormState]);

  const updateDeparture = useCallback((stopId) => {
    setFormState((formState) => {
      return { ...formState, departure: stopId };
    });
  }, [setFormState]);

  const updateDestination = useCallback((stopId) => {
    setFormState((formState) => {
      return { ...formState, destination: stopId };
    });
  }, [setFormState]);

  useEffect(() => {
    if (routeData !== undefined) {
      const stopList = buildStopList(routeData, direction);
      const optionList = stopList.map(stop =>
          <option key={stop.stop_id} value={stop.stop_id}>{stop.stop_name}</option>
      );
      setFormStopOptions(optionList);

      updateDeparture(stopList[0].stop_id);
      updateDestination(stopList[stopList.length - 1].stop_id);
    }
  }, [routeData, direction, setFormState, updateDeparture, updateDestination]);

  return (
    <div>
      <Loading isLoading={routeData === undefined}>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="formDirection" id="formDirectionInbound" value="0" checked={direction === 0} onChange={e => updateDirection(Number(e.target.value))} />
          <label className="form-check-label" htmlFor="formDirectionInbound">
            Inbound
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="formDirection" id="formDirectionOutbound" value="1" checked={direction === 1} onChange={e => updateDirection(Number(e.target.value))} />
          <label className="form-check-label" htmlFor="formDirectionOutbound">
            Outbound
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="formTravelTime">Travel Time to Departure Stop</label>
          <input type="text" className="form-control" id="formTravelTime" aria-describedby="formTravelTimeHelp" placeholder="Travel time to departure stop in minutes" onChange={e => updateTravelTime(Number(e.target.value))} />
            <small id="formTravelTimeHelp" className="form-text text-muted">The time it'll take you to get to the departure point in minutes.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="formRoute">Departure</label>
          <select className="form-control" id="formDeparture" value={departure} onChange={e => updateDeparture(Number(e.target.value))}>
            {formStopOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="formRoute">Destination</label>
          <select className="form-control" id="formDestination" value={destination} onChange={e => updateDestination(Number(e.target.value))}>
            {formStopOptions}
          </select>
        </div>
      </Loading>
    </div>
  )
}
