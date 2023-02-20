import useRouteIndex from '../effects/useRouteIndex';
import { Link } from "react-router-dom";

export default function Index() {
    console.log("load")

    const routes = useRouteIndex();
    
    if (routes == null) {
        return (<div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>)
    }

    let routeLinks = routes.routes.map(route =>
        <li className="nav-item">
            <Link className="nav-link" to={`/route/${route.route}`}>{route.short_name}: {route.long_name}</Link>
        </li>
    )
    
    return (
        <div>
            <h1>Where's My Ride?</h1>
            <ul className="nav flex-column">
                {routeLinks}
            </ul>
        </div>
    );
}
