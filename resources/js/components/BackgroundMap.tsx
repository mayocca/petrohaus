import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import type { GasStation } from "../types";
import "leaflet/dist/leaflet.css";
import GasStationMarker from "./GasStationMarker";
import { useEffect } from "react";

interface SimpleMapProps {
    gasStations: GasStation[];
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

export default function BackgroundMap({
    gasStations,
    onMapMove,
}: SimpleMapProps) {
    return (
        <MapContainer
            center={[-40, -59]}
            zoom={4}
            zoomControl={false}
            className="w-full h-screen"
        >
            <ZoomControl position="bottomright" />
            <MapEventHandler onMapMove={onMapMove} />

            <TileLayer
                url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
                attribution='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
                minZoom={3}
                maxZoom={18}
            />

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
