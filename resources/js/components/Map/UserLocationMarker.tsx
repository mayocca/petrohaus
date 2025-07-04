import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { useMap } from "../../contexts/MapContext";

export default function UserLocationMarker() {
    const { userLocation } = useMap();

    if (!userLocation) return null;

    const radius = Math.max(8, Math.min(userLocation.accuracy / 2, 100));

    return (
        <CircleMarker
            center={[userLocation.latitude, userLocation.longitude]}
            pathOptions={{
                color: "#fff",
                fillColor: "#2F6DB6",
                fillOpacity: 1,
                weight: 3,
            }}
            radius={8}
        >
            <Popup>
                Estás a {Math.round(userLocation.accuracy)} metros de este punto
            </Popup>
        </CircleMarker>
    );
}
