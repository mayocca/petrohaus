import {
    Map,
    TileLayer,
    Control,
    CircleMarker,
    Marker,
    DivIcon,
} from "leaflet";
import { defineComponent } from "../utils.ts";

interface GasStation {
    id: number;
    name: string;
    franchise_name: string;
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    price: number;
    validity_date: string;
    product_name: string;
    formatted_price: string;
}

export default defineComponent(() => ({
    map: null as Map | null,
    userMarker: null as CircleMarker | null,
    gasStationMarkers: [] as Marker[],
    selectedProduct: null as number | null,
    searchButton: null as Control | null,
    isSearching: false,

    init() {
        this.map = new Map(this.$el, {
            center: [-40, -59],
            zoom: 4,
            zoomControl: false,
        });

        const zoomControl = new Control.Zoom({
            position: "bottomright",
        });

        this.map?.addControl(zoomControl);

        /** @source https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion */
        const tileLayer = new TileLayer(
            "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png",
            {
                attribution:
                    '<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
                minZoom: 3,
                maxZoom: 18,
            }
        );

        this.map?.addLayer(tileLayer);

        // Set up location event handlers
        this.setupLocationHandlers();

        // Set up map event handlers
        this.setupMapEventHandlers();

        // Set up Livewire event listeners
        this.setupLivewireEventListeners();

        // Request location permissions and start tracking
        this.requestLocationPermission();
    },

    setupLocationHandlers() {
        if (!this.map) return;

        // Handle successful location finding
        this.map.on("locationfound", (e: any) => {
            const radius = e.accuracy / 2;
            const latlng = e.latlng;

            // Remove existing marker if any
            if (this.userMarker && this.map) {
                this.map.removeLayer(this.userMarker as any);
            }

            // Create user location marker (blue dot)
            this.userMarker = new CircleMarker(latlng, {
                color: "#fff",
                fillColor: "#2F6DB6",
                fillOpacity: 1,
                weight: 3,
                radius: 8,
            }).bindPopup(`Estás a ${Math.round(radius)} metros de este punto`);

            // Add to map
            if (this.map) {
                this.map.addLayer(this.userMarker as any);
            }
        });

        // Handle location errors
        this.map.on("locationerror", (e: any) => {
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
    },

    setupMapEventHandlers() {
        if (!this.map) return;

        // Show search button when map is moved and product is selected
        this.map.on("moveend", () => {
            if (this.selectedProduct && !this.isSearching) {
                this.showSearchButton();
            }
        });
    },

    setupLivewireEventListeners() {
        // Listen for product selection from Livewire component
        window.addEventListener("productSelected", (event: any) => {
            this.selectedProduct = event.detail ? parseInt(event.detail) : null;
            this.onProductSelected();
        });
    },

    onProductSelected() {
        if (this.selectedProduct && this.map) {
            this.searchGasStations();
        } else {
            this.clearGasStationMarkers();
            this.hideSearchButton();
        }
    },

    async searchGasStations() {
        if (!this.map || !this.selectedProduct) return;

        this.isSearching = true;
        this.hideSearchButton();

        try {
            const bounds = this.map.getBounds();

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
                    product_id: this.selectedProduct,
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
                this.displayGasStations(data.data);
            }
        } catch (error) {
            console.error("Error searching gas stations:", error);
        } finally {
            this.isSearching = false;
        }
    },

    displayGasStations(gasStations: GasStation[]) {
        this.clearGasStationMarkers();

        if (!this.map) return;

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

            this.gasStationMarkers.push(marker);
            this.map?.addLayer(marker as any);
        });
    },

    clearGasStationMarkers() {
        this.gasStationMarkers.forEach((marker) => {
            if (this.map) {
                this.map.removeLayer(marker as any);
            }
        });
        this.gasStationMarkers = [];
    },

    showSearchButton() {
        if (this.searchButton || !this.map) return;

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
                    this.searchGasStations();
                });

                return div;
            },
        });

        this.searchButton = new SearchControl({ position: "topright" });
        this.map.addControl(this.searchButton);
    },

    hideSearchButton() {
        if (this.searchButton && this.map) {
            this.map.removeControl(this.searchButton);
            this.searchButton = null;
        }
    },

    requestLocationPermission() {
        if (!this.map) return;

        // Use Leaflet's native locate method
        this.map.locate({
            setView: true,
            maxZoom: 16,
            watch: true,
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
        });
    },

    destroy() {
        if (!this.map) return;

        // Stop location watching
        this.map.stopLocate();

        // Remove location marker
        if (this.userMarker) {
            this.map.removeLayer(this.userMarker as any);
            this.userMarker = null;
        }

        // Clear gas station markers
        this.clearGasStationMarkers();

        // Remove search button
        this.hideSearchButton();

        // Remove event listeners
        this.map.off("locationfound");
        this.map.off("locationerror");
        this.map.off("moveend");

        // Clean up map
        this.map.remove();
        this.map = null;
    },
}));
