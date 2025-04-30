import { Map, TileLayer, Control } from "leaflet";

export default () => ({
    init() {
        const map = new Map("map", {
            center: [-40, -59],
            zoom: 4,
            zoomControl: false,
        });

        const zoomControl = new Control.Zoom({
            position: "bottomright",
        });

        map.addControl(zoomControl);

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

        map.addLayer(tileLayer);
    },
});
