import { Map, TileLayer, Control, CircleMarker } from "leaflet";
import { defineComponent } from "../utils.ts";

export default defineComponent(() => ({
    map: null as Map | null,
    userMarker: null as CircleMarker | null,

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
                fillColor: "#3b82f6",
                fillOpacity: 1,
                weight: 3,
                radius: 8,
            }).bindPopup(
                `You are within ${Math.round(radius)} meters from this point`
            );

            // Add to map
            if (this.map) {
                this.map.addLayer(this.userMarker as any);
            }
        });

        // Handle location errors
        this.map.on("locationerror", (e: any) => {
            let message = "Location access failed.";

            // The error message from Leaflet's locate method
            if (e.message) {
                if (e.message.includes("denied")) {
                    message = "Location access denied by user.";
                } else if (e.message.includes("unavailable")) {
                    message = "Location information is unavailable.";
                } else if (e.message.includes("timeout")) {
                    message = "Location request timed out.";
                }
            }

            console.warn("Location error:", message);
            // Keep the default map view if location access fails
        });
    },

    requestLocationPermission() {
        if (!this.map) return;

        // Use Leaflet's native locate method
        this.map.locate({
            setView: true, // Automatically set the map view to user location
            maxZoom: 16, // Maximum zoom when setting view
            watch: true, // Continue watching for location changes (real-time tracking)
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
        if (this.userMarker && this.map) {
            this.map.removeLayer(this.userMarker as any);
            this.userMarker = null;
        }

        // Remove event listeners
        this.map.off("locationfound");
        this.map.off("locationerror");

        // Clean up map
        this.map.remove();
        this.map = null;
    },
}));
