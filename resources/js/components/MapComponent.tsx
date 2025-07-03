import { useEffect, useRef, useState } from "react";
import {
    Map,
    TileLayer,
    Control,
    CircleMarker,
    Marker,
    DivIcon,
} from "leaflet";
import type { GasStation } from "../types";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<Map | null>(null);
    const [userMarker, setUserMarker] = useState<CircleMarker | null>(null);
    const [gasStationMarkers, setGasStationMarkers] = useState<Marker[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [searchButton, setSearchButton] = useState<Control | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Initialize map
    useEffect(() => {
        if (!mapRef.current) return;

        const mapInstance = new Map(mapRef.current, {
            center: [-40, -59],
            zoom: 4,
            zoomControl: false,
        });

        const zoomControl = new Control.Zoom({
            position: "bottomright",
        });

        mapInstance.addControl(zoomControl);

        // @source https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion
        const tileLayer = new TileLayer(
            "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png",
            {
                attribution:
                    '<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
                minZoom: 3,
                maxZoom: 18,
            }
        );

        mapInstance.addLayer(tileLayer);

        // Set up location event handlers
        setupLocationHandlers(mapInstance);

        // Set up map event handlers
        setupMapEventHandlers(mapInstance);

        // Request location permissions and start tracking
        requestLocationPermission(mapInstance);

        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, []);

    // Listen for product selection events
    useEffect(() => {
        const handleProductSelected = (event: CustomEvent) => {
            const productId = event.detail ? parseInt(event.detail) : null;
            setSelectedProduct(productId);
            onProductSelected(productId);
        };

        window.addEventListener(
            "productSelected",
            handleProductSelected as EventListener
        );

        return () => {
            window.removeEventListener(
                "productSelected",
                handleProductSelected as EventListener
            );
        };
    }, [map]);

    const setupLocationHandlers = (mapInstance: Map) => {
        // Handle successful location finding
        mapInstance.on("locationfound", (e: any) => {
            const radius = e.accuracy / 2;
            const latlng = e.latlng;

            // Remove existing marker if any
            if (userMarker) {
                mapInstance.removeLayer(userMarker);
            }

            // Create user location marker (blue dot)
            const newUserMarker = new CircleMarker(latlng, {
                color: "#fff",
                fillColor: "#2F6DB6",
                fillOpacity: 1,
                weight: 3,
                radius: 8,
            }).bindPopup(`Estás a ${Math.round(radius)} metros de este punto`);

            mapInstance.addLayer(newUserMarker);
            setUserMarker(newUserMarker);
        });

        // Handle location errors
        mapInstance.on("locationerror", (e: any) => {
            let message = "Error al acceder a la ubicación.";

            if (e.message) {
                if (e.message.includes("denied")) {
                    message = "Acceso a ubicación denegado por el usuario.";
                } else if (e.message.includes("unavailable")) {
                    message = "Información de ubicación no disponible.";
                } else if (e.message.includes("timeout")) {
                    message =
                        "Tiempo de espera agotado para obtener ubicación.";
                }
            }

            console.warn("Error de ubicación:", message);
        });
    };

    const setupMapEventHandlers = (mapInstance: Map) => {
        // Show search button when map is moved and product is selected
        mapInstance.on("moveend", () => {
            if (selectedProduct && !isSearching) {
                showSearchButton(mapInstance);
            }
        });
    };

    const onProductSelected = (productId: number | null) => {
        if (productId && map) {
            searchGasStations();
        } else {
            clearGasStationMarkers();
            hideSearchButton();
        }
    };

    const searchGasStations = async () => {
        if (!map || !selectedProduct) return;

        setIsSearching(true);
        hideSearchButton();

        try {
            const bounds = map.getBounds();

            const response = await fetch("/api/gas-stations/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify({
                    product_id: selectedProduct,
                    bounds: {
                        north: bounds.getNorth(),
                        south: bounds.getSouth(),
                        east: bounds.getEast(),
                        west: bounds.getWest(),
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Error al buscar estaciones de servicio");
            }

            const data = await response.json();

            if (data.success) {
                displayGasStations(data.data);
            }
        } catch (error) {
            console.error("Error searching gas stations:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const displayGasStations = (gasStations: GasStation[]) => {
        clearGasStationMarkers();

        if (!map) return;

        const newMarkers: Marker[] = [];

        gasStations.forEach((station, index) => {
            const icon = new DivIcon({
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

            const marker = new Marker([station.latitude, station.longitude], {
                icon,
            });

            marker.bindPopup(`
                <div class="gas-station-popup" style="min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; color: #2F6DB6; font-weight: bold;">
                        ${station.franchise_name}
                    </h4>
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #333;">
                        <strong>${station.name}</strong>
                    </p>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
                        ${station.address}, ${station.city}
                    </p>
                    <div style="background: #f0f8ff; padding: 8px; border-radius: 4px; border-left: 4px solid #2F6DB6;">
                        <p style="margin: 0; font-size: 14px; color: #333;">
                            <strong>${station.product_name}</strong>
                        </p>
                        <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: bold; color: #2F6DB6;">
                            ${station.formatted_price}
                        </p>
                        <p style="margin: 4px 0 0 0; font-size: 11px; color: #888;">
                            Actualizado: ${new Date(
                                station.validity_date
                            ).toLocaleDateString("es-AR")}
                        </p>
                    </div>
                </div>
            `);

            newMarkers.push(marker);
            map.addLayer(marker);
        });

        setGasStationMarkers(newMarkers);
    };

    const clearGasStationMarkers = () => {
        gasStationMarkers.forEach((marker) => {
            if (map) {
                map.removeLayer(marker);
            }
        });
        setGasStationMarkers([]);
    };

    const showSearchButton = (mapInstance: Map) => {
        if (searchButton || !mapInstance) return;

        const SearchControl = Control.extend({
            onAdd: () => {
                const div = document.createElement("div");
                div.className = "leaflet-control leaflet-bar";
                div.innerHTML = `
                    <button style="
                        background: #2F6DB6;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        white-space: nowrap;
                    " onmouseover="this.style.background='#245a94'" onmouseout="this.style.background='#2F6DB6'">
                        Buscar en esta área
                    </button>
                `;

                div.addEventListener("click", () => {
                    searchGasStations();
                });

                return div;
            },
        });

        const newSearchButton = new SearchControl({ position: "topright" });
        mapInstance.addControl(newSearchButton);
        setSearchButton(newSearchButton);
    };

    const hideSearchButton = () => {
        if (searchButton && map) {
            map.removeControl(searchButton);
            setSearchButton(null);
        }
    };

    const requestLocationPermission = (mapInstance: Map) => {
        // Use Leaflet's native locate method
        mapInstance.locate({
            setView: true,
            maxZoom: 16,
            watch: true,
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
        });
    };

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
