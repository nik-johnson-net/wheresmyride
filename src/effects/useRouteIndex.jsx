import { useState, useEffect } from 'react';

export default function useRouteIndex() {
    const [routeList, setRouteList] = useState();

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/routes/routes.json`).then((resp) => {
            if (!resp.ok) {
                console.log("failed to get rtd route index", resp.statusText)
                setRouteList({})
            } else {
                resp.json().then((data) => setRouteList(data))
            }
        })
    }, [setRouteList]);
    return routeList;
}
