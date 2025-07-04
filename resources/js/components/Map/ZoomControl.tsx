import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Control } from "leaflet";

export default function ZoomControl() {
    const map = useMap();

    useEffect(() => {
        const zoomControl = new Control.Zoom({
            position: "bottomright",
        });

        map.addControl(zoomControl);

        return () => {
            map.removeControl(zoomControl);
        };
    }, [map]);

    return null;
}
