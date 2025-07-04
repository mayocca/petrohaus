import React, { useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { Control, DomUtil } from "leaflet";
import { useMap } from "../../contexts/MapContext";

export default function SearchButton() {
    const leafletMap = useLeafletMap();
    const { showSearchButton, searchGasStations, isSearching } = useMap();

    useEffect(() => {
        if (!showSearchButton || isSearching) return;

        const SearchControl = Control.extend({
            onAdd: () => {
                const div = DomUtil.create(
                    "div",
                    "leaflet-control leaflet-bar"
                );
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

        const searchControl = new SearchControl({ position: "topright" });
        leafletMap.addControl(searchControl);

        return () => {
            leafletMap.removeControl(searchControl);
        };
    }, [leafletMap, showSearchButton, searchGasStations, isSearching]);

    return null;
}
