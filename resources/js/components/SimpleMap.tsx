import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GasStation } from "../types";

interface SimpleMapProps {
    gasStations: GasStation[];
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

export default function SimpleMap({ gasStations }: SimpleMapProps) {
    return (
        <MapContainer
            center={[-40, -59]}
            zoom={4}
            zoomControl={true}
            style={{ width: "100%", height: "100vh" }}
            className="z-0"
        >
            <TileLayer
                url="https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png"
                attribution='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>'
                minZoom={3}
                maxZoom={18}
            />

            {gasStations.map((station, index) => (
                <Marker
                    key={`${station.id}-${index}`}
                    position={[station.latitude, station.longitude]}
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
                            <div className="space-y-2">
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
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
