import { useParams } from 'react-router-dom';
import NextTrip from '../components/nextTrip';

export default function Trip() {
    let { tripName } = useParams();
    const storage = window.localStorage;
    const trip = JSON.parse(storage.getItem(`trip/${tripName}`));

    let element;
    if (trip === null) {
        element = <p>The trip {tripName} does not exist. Would you like to create it?</p>;
    } else {
        element = <NextTrip trip={trip} />
    }

    return (
    <div>
        {element}
    </div>);
}
