import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/loading';
import NewTripRouteForms from '../components/newTripRouteForm';
import useRouteIndex from '../effects/useRouteIndex';

export default function NewTrip() {
  const { tripName } = useParams();
  const routeIndex = useRouteIndex();
  const [formState, setFormState] = useState({route: "0", direction: 0});
  const storage = window.localStorage;
  const trip = storage.getItem(`trip/${tripName}`);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    storage.setItem(`trip/${formState.name}`, JSON.stringify(formState));
    if (!storage.getItem("defaultTrip")) {
      storage.setItem("defaultTrip", formState.name);
    }
    navigate(`/trip/${formState.name}`);
  }

  let errors;

  if (trip !== null) {
    errors = <p>Trip {tripName} already exists</p>
  }

  let routeOptions;
  if (routeIndex !== undefined) {
    routeOptions = routeIndex.routes.map(r =>
      <option key={r.route} value={r.route}>{r.route}</option>
    );
  }

  let routeForms;
  if (formState.route !== undefined) {
    routeForms = <NewTripRouteForms route={formState.route} direction={formState.direction} departure={formState.departure} destination={formState.destination} formState={formState} setFormState={setFormState} />;
  }

  return (
    <div>
      <h1>New Trip</h1>
      {errors}
      <Loading isLoading={routeIndex === undefined}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="formTripName">Trip Name</label>
            <input type="text" className="form-control" id="formTripName" aria-describedby="tripNameHelp" placeholder="Enter Trip Name" onChange={e => setFormState((s) => { return {...s, name: e.target.value}; })} required />
              <small id="tripNameHelp" className="form-text text-muted">The name you will use to identify this trip.</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="formRoute">Route</label>
            <select className="form-control" id="formRoute" onChange={e => setFormState((s) => { return {...s, route: e.target.value}; })}>
              {routeOptions}
            </select>
          </div>

          {routeForms}

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </Loading>
    </div>);
}
