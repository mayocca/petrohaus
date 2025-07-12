import { Marker, Popup, useMap } from "react-leaflet";
import type { GasStation } from "../types";
import { divIcon } from "leaflet";

interface GasStationMarkerProps {
    station: GasStation;
    index: number;
}
function createGasStationIcon(index: number) {
    return divIcon({
        html: `
            <div style="
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

export default function GasStationMarker({
    station,
    index,
}: GasStationMarkerProps) {
    return (
        <Marker
            key={`${station.id}-${index}`}
            position={[
                station.location.coordinates[1],
                station.location.coordinates[0],
            ]}
            icon={createGasStationIcon(index)}
        >
            <Popup>
                <div style={{ minWidth: "200px" }}>
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

                    {/* Show day/night prices in popup */}
                    {/* <div className="space-y-2">
                                {station.prices.map(
                                    (productPrice, priceIndex) => (
                                        <div
                                            key={priceIndex}
                                            style={{
                                                background: "#f0f8ff",
                                                padding: "8px",
                                                borderRadius: "4px",
                                                borderLeft: "4px solid #2F6DB6",
                                                marginBottom: "4px",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    color: "#333",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {productPrice.product_name}
                                            </p>

                                            {productPrice.day_price && (
                                                <p
                                                    style={{
                                                        margin: "2px 0",
                                                        fontSize: "12px",
                                                        color: "#2F6DB6",
                                                    }}
                                                >
                                                    ☀️ Día:{" "}
                                                    <strong>
                                                        {productPrice.day_price}
                                                    </strong>
                                                </p>
                                            )}

                                            {productPrice.night_price && (
                                                <p
                                                    style={{
                                                        margin: "2px 0",
                                                        fontSize: "12px",
                                                        color: "#2F6DB6",
                                                    }}
                                                >
                                                    🌙 Noche:{" "}
                                                    <strong>
                                                        {
                                                            productPrice.night_price
                                                        }
                                                    </strong>
                                                </p>
                                            )}

                                            <p
                                                style={{
                                                    margin: "4px 0 0 0",
                                                    fontSize: "11px",
                                                    color: "#888",
                                                }}
                                            >
                                                Actualizado:{" "}
                                                {new Date(
                                                    productPrice.validity_date
                                                ).toLocaleDateString("es-AR")}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div> */}
                </div>
            </Popup>
        </Marker>
    );
}
