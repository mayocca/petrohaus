import { Head } from "@inertiajs/react";
import BackgroundMap from "@/components/BackgroundMap";
import type { GasStation } from "../types";
import SearchAreaButton from "@/components/SearchAreaButton";
import { useState } from "react";

interface IndexProps {
    gasStations: GasStation[];
}

export default function Index({ gasStations }: IndexProps) {
    const [mapBounds, setMapBounds] = useState<{
        north: number;
        south: number;
        east: number;
        west: number;
    } | null>(null);
    const [showSearchButton, setShowSearchButton] = useState(false);

    const handleMapMove = (bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    }) => {
        setMapBounds(bounds);
        setShowSearchButton(true);
    };

    return (
        <>
            <Head title="Petrohaus" />

            <BackgroundMap
                gasStations={gasStations}
                onMapMove={handleMapMove}
            />

            <SearchAreaButton
                bounds={mapBounds || undefined}
                visible={showSearchButton}
            />
        </>
    );
}
