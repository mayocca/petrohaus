import React, { useCallback, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    useMap as useLeafletMap,
    useMapEvents,
} from "react-leaflet";
import { useMap } from "../../contexts/MapContext";
import { useLocationTracking } from "../../hooks/useMapActions";
import UserLocationMarker from "@/components/Map/UserLocationMarker";
import GasStationMarkers from "@/components/Map/GasStationMarkers";
import SearchButton from "@/components/Map/SearchButton";
import ZoomControl from "@/components/Map/ZoomControl";
import "leaflet/dist/leaflet.css";

// Component to handle map events and sync with context
function MapEventHandler() {
    const leafletMap = useLeafletMap();
    const { setMapBounds, selectedProduct, isSearching, setShowSearchButton } =
        useMap();
    const { handleLocationFound, handleLocationError } = useLocationTracking();

    // Handle map move events
    useMapEvents({
        moveend: useCallback(() => {
            const bounds = leafletMap.getBounds();
            setMapBounds({
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
            });

            // Show search button if product is selected and not currently searching
            if (selectedProduct && !isSearching) {
                setShowSearchButton(true);
            }
        }, [
            leafletMap,
            setMapBounds,
            selectedProduct,
            isSearching,
            setShowSearchButton,
        ]),

        locationfound: useCallback(
            (e: any) => {
                handleLocationFound(e.latlng.lat, e.latlng.lng, e.accuracy);
            },
            [handleLocationFound]
        ),

        locationerror: useCallback(
            (e: any) => {
                handleLocationError(e as GeolocationPositionError);
            },
            [handleLocationError]
        ),
    });

    // Start location tracking when component mounts
    useEffect(() => {
        leafletMap.locate({
            setView: true,
            maxZoom: 16,
            watch: true,
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
        });
    }, [leafletMap]);

    return null;
}

export default function BackgroundMap() {
    return (
        <MapContainer
            center={[-40, -59]}
            zoom={4}
            zoomControl={false}
            style={{ width: "100%", height: "100vh" }}
            className="z-0"
        >
            <TileLayer
                url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
                attribution='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
                minZoom={3}
                maxZoom={18}
            />

            <MapEventHandler />
            <UserLocationMarker />
            <GasStationMarkers />
            <SearchButton />
            <ZoomControl />
        </MapContainer>
    );
}
