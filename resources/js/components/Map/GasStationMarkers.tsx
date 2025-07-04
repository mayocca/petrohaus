import React from "react";
import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { useMap } from "../../contexts/MapContext";
import type { GasStation } from "../../types";

function createGasStationIcon(index: number) {
    return divIcon({
        html: `
            <div class="gas-station-marker" style="
                background: #2F6DB6;
                border: 3px solid white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
                ${index + 1}
            </div>
        `,
        className: "gas-station-marker-wrapper",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
}

function GasStationPopup({ station }: { station: GasStation }) {
    return (
        <Popup>
            <div className="gas-station-popup" style={{ minWidth: "200px" }}>
                <h4
                    style={{
                        margin: "0 0 8px 0",
                        color: "#2F6DB6",
                        fontWeight: "bold",
                    }}
                >
                    {station.franchise_name}
                </h4>
                <p
                    style={{
                        margin: "0 0 4px 0",
                        fontSize: "14px",
                        color: "#333",
                    }}
                >
                    <strong>{station.name}</strong>
                </p>
                <p
                    style={{
                        margin: "0 0 8px 0",
                        fontSize: "12px",
                        color: "#666",
                    }}
                >
                    {station.address}, {station.city}
                </p>
                <div
                    style={{
                        background: "#f0f8ff",
                        padding: "8px",
                        borderRadius: "4px",
                        borderLeft: "4px solid #2F6DB6",
                    }}
                >
                    <p style={{ margin: "0", fontSize: "14px", color: "#333" }}>
                        <strong>{station.product_name}</strong>
                    </p>
                    <p
                        style={{
                            margin: "4px 0 0 0",
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#2F6DB6",
                        }}
                    >
                        {station.formatted_price}
                    </p>
                    <p
                        style={{
                            margin: "4px 0 0 0",
                            fontSize: "11px",
                            color: "#888",
                        }}
                    >
                        Actualizado:{" "}
                        {new Date(station.validity_date).toLocaleDateString(
                            "es-AR"
                        )}
                    </p>
                </div>
            </div>
        </Popup>
    );
}

export default function GasStationMarkers() {
    const { gasStations } = useMap();

    return (
        <>
            {gasStations.map((station, index) => (
                <Marker
                    key={`${station.id}-${index}`}
                    position={[station.latitude, station.longitude]}
                    icon={createGasStationIcon(index)}
                >
                    <GasStationPopup station={station} />
                </Marker>
            ))}
        </>
    );
}
