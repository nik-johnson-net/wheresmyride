#!/usr/bin/env python3

import csv
import io
import json
import os
import urllib.request
import zipfile

def load_data(zipdata, filename, parser):
    with zipdata.open(filename) as csv_file:
        return [parser(r) for idx, r in enumerate(csv.reader(io.TextIOWrapper(csv_file))) if idx != 0]

def load_routes(zipdata):
    return load_data(zipdata, 'routes.txt', lambda r: [
        r[0], # route id
        r[1], # agency
        r[2], # route short name
        r[3], # route long name
        r[4], # route desc
        int(r[5]), # route type
        r[6], # route url
        r[7], # route color
        r[8], # route text color
    ])

def load_stops(zipdata):
    return load_data(zipdata, 'stops.txt', lambda r: [
        int(r[0]), # stop_id
        r[1], # stop code
        r[2], # stop name
        r[3], # stop desc
        r[4], # stop lat
        r[5], # stop lon
        r[6], # zone id
        r[7], # stop url
        int(r[8]), # location type
        r[9], # parent_station
        r[10], # stop timezone
        int(r[11]), # wheelchair boarding
    ])
        
def load_stop_times(zipdata):
    return load_data(zipdata, 'stop_times.txt', lambda r: [
        int(r[0]), # Trip ID
        r[1], # Arrival Time HH:MM:SS
        r[2], # Departure Time HH:MM:SS
        int(r[3]), # Stop ID
        int(r[4]), # Stop sequence
        r[5], # Stop Headsign
        int(r[6]), # Pickup Type
        int(r[7]), # Drop Off Type
        r[8], # Shape Dist Traveled
        int(r[9]) # Timepoint
    ])
   
def load_trips(zipdata):
    return load_data(zipdata, 'trips.txt', lambda r: [
        r[0], # Route ID (Can be string)
        r[1], # Service ID
        int(r[2]), # Trip ID
        r[3], # Trip Headsign
        int(r[4]), # Direction ID
        r[5], # block_id
        int(r[6]), # shape_id
    ])

def stop_info(stops, stop_id):
    stop = [s for s in stops if s[0] == stop_id]
    if len(stop) >= 1:
        return stop[0]
    else:
        return None

def build_stops(trip_id, stops, stop_times):
    stop_times = [st for st in stop_times if st[0] == trip_id]
    stop_times.sort(key=lambda x: x[4])
    result = []
    for st in stop_times:
        si = stop_info(stops, st[3])
        result.append({
            'stop_id': st[3],
            'stop_name': si[2],
            'stop_desc': si[3],
            'arrival_time': st[1],
            'departure_time': st[2],
            'timepoint': st[9],
        })
    return result

def build_route(route, trips, stops, stop_times):
    trips = [t for t in trips if t[0] == route[0]]
    route_trips = [{
        'id': t[2],
        'headsign': t[3],
        'direction': t[4],
        'stops': build_stops(t[2], stops, stop_times),
    } for t in trips]
    return {
        'id': route[0],
        'short_name': route[2],
        'long_name': route[3],
        'desc': route[4],
        'type': route[5],
        'url': route[6],
        'trips': route_trips,
    }


if __name__ == "__main__":
    print("Downloading RTD GTFS data")
    request = urllib.request.Request("https://www.rtd-denver.com/files/gtfs/google_transit.zip")
    request.add_header('User-Agent', 'wheresmybus/1.0')
    with urllib.request.urlopen(request) as response:
        with zipfile.ZipFile(io.BytesIO(response.read())) as zipdata:
            routes = load_routes(zipdata)
            stops = load_stops(zipdata)
            stop_times = load_stop_times(zipdata)
            trips = load_trips(zipdata)

    if os.path.exists('public/routes'):
        for root, dirs, files in os.walk('public/routes', topdown = False):
            for file in files:
                os.remove(os.path.join(root, file))
            for dir in dirs:
                os.rmdir(os.path.join(root, dir))
    os.rmdir('public/routes')
    os.mkdir('public/routes')

    for route in routes:
        print(f"Building route {route[0]}")
        hydrated_route = build_route(route, trips, stops, stop_times)
        with open(f"public/routes/{hydrated_route['id']}.json", mode='w') as f:
            f.write(json.dumps(hydrated_route))

    print("Building routing index")
    with open("public/routes/routes.json", mode='w') as f:
        route_index = [{
            'route': r[0],
            'short_name': r[2],
            'long_name': r[3],
            'desc': r[4],
        } for r in routes]
        f.write(json.dumps({
            'routes': route_index,
        }))
