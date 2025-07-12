import {
    MapContainer,
    TileLayer,
    ZoomControl,
    useMap,
    Marker,
    Circle,
} from "react-leaflet";
import type { GasStation } from "../types";
import "leaflet/dist/leaflet.css";
import GasStationMarker from "./GasStationMarker";
import { useEffect, useRef } from "react";
import { divIcon } from "leaflet";

interface SimpleMapProps {
    gasStations: GasStation[];
    userLocation?: GeolocationPosition | null;
    centerOnLocation?: boolean;
    onMapMove?: (bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    }) => void;
}

function MapEventHandler({
    onMapMove,
}: {
    onMapMove?: (bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    }) => void;
}) {
    const map = useMap();

    useEffect(() => {
        const handleMoveEnd = () => {
            if (onMapMove) {
                const bounds = map.getBounds();
                onMapMove({
                    north: bounds.getNorth(),
                    south: bounds.getSouth(),
                    east: bounds.getEast(),
                    west: bounds.getWest(),
                });
            }
        };

        map.on("moveend", handleMoveEnd);
        map.on("zoomend", handleMoveEnd);

        // Cleanup event listeners
        return () => {
            map.off("moveend", handleMoveEnd);
            map.off("zoomend", handleMoveEnd);
        };
    }, [map, onMapMove]);

    return null;
}

function LocationHandler({
    userLocation,
    centerOnLocation,
}: {
    userLocation?: GeolocationPosition | null;
    centerOnLocation?: boolean;
}) {
    const map = useMap();
    const hasSetInitialView = useRef(false);

    useEffect(() => {
        if (userLocation && (!hasSetInitialView.current || centerOnLocation)) {
            const { latitude, longitude } = userLocation.coords;
            map.setView([latitude, longitude], 13);
            hasSetInitialView.current = true;
        }
    }, [map, userLocation, centerOnLocation]);

    return null;
}

// Create user location icon
const createUserLocationIcon = () => {
    return divIcon({
        html: `
            <div style="
                width: 20px;
                height: 20px;
                background-color: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                position: relative;
            ">
                <div style="
                    width: 8px;
                    height: 8px;
                    background-color: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                "></div>
            </div>
        `,
        className: "user-location-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

export default function BackgroundMap({
    gasStations,
    userLocation,
    centerOnLocation,
    onMapMove,
}: SimpleMapProps) {
    const defaultCenter: [number, number] = [-40, -59];
    const defaultZoom = 4;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            zoomControl={false}
            className="w-full h-screen"
        >
            <ZoomControl position="bottomright" />
            <MapEventHandler onMapMove={onMapMove} />
            <LocationHandler
                userLocation={userLocation}
                centerOnLocation={centerOnLocation}
            />

            <TileLayer
                url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
                attribution='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
                minZoom={3}
                maxZoom={18}
            />

            {/* User location marker and accuracy circle */}
            {userLocation && (
                <>
                    <Marker
                        position={[
                            userLocation.coords.latitude,
                            userLocation.coords.longitude,
                        ]}
                        icon={createUserLocationIcon()}
                    />
                    <Circle
                        center={[
                            userLocation.coords.latitude,
                            userLocation.coords.longitude,
                        ]}
                        radius={userLocation.coords.accuracy || 100}
                        pathOptions={{
                            color: "#3b82f6",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.1,
                            weight: 2,
                        }}
                    />
                </>
            )}

            {gasStations.map((station, index) => (
                <GasStationMarker
                    key={station.id}
                    station={station}
                    index={index}
                />
            ))}
        </MapContainer>
    );
}
