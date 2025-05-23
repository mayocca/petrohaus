import { Map, TileLayer, Control } from "leaflet";
import { defineComponent } from "@/alpine/utils.ts";

export default defineComponent(() => ({
    map: null as Map | null,
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
    },
}));
