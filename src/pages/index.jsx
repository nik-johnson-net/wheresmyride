import { Link } from "react-router-dom";
import NextTrip from '../components/nextTrip';

export default function Index() {
    const defaultTrip = window.localStorage.getItem('defaultTrip');
    let element;
    if (defaultTrip) {
        const tripValue = window.localStorage.getItem(`trip/${defaultTrip}`);
        const trip = JSON.parse(tripValue);
        element = <NextTrip trip={trip} />;
    } else {
        element = <p>It looks like you don't have trips. Would you like to create a <Link to={'/newtrip'}>new trip</Link>?</p>;
    }
    
    return (
        <div>
            {element}
        </div>
    );
}
