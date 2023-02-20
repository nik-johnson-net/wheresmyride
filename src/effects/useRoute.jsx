import { useState, useEffect } from 'react';

export default function useRoute(route) {
    const [routeList, setRouteList] = useState();

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/routes/${route}.json`).then((resp) => {
            if (!resp.ok) {
                console.log("failed to get rtd route", route, resp.statusText)
                setRouteList({})
            } else {
                resp.json().then((data) => setRouteList(data))
            }
        })
    }, [route, setRouteList]);
    return routeList;
}
