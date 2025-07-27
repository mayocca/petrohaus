import { Head } from "@inertiajs/react";
import BackgroundMap from "@/components/BackgroundMap";
import type { GasStation } from "../types";
import SearchAreaButton from "@/components/SearchAreaButton";
import LocationPermissionDialog from "@/components/LocationPermissionDialog";
import MyLocationButton from "@/components/MyLocationButton";
import { useState, useEffect } from "react";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import {
    getBooleanFromStorage,
    setBooleanInStorage,
    STORAGE_KEYS,
} from "@/utils/localStorage";

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
    const [showLocationDialog, setShowLocationDialog] = useState(false);
    const [hasUserDeclined, setHasUserDeclined] = useState(() =>
        getBooleanFromStorage(STORAGE_KEYS.LOCATION_PERMISSION_DECLINED)
    );
    const [centerOnLocation, setCenterOnLocation] = useState(false);

    const {
        position,
        error,
        loading,
        permission,
        hasAskedPermission,
        requestLocation,
    } = useLocationPermission();

    // Show location dialog based on permission state and user actions
    useEffect(() => {
        const shouldShowDialog =
            permission === "prompt" && !hasAskedPermission && !hasUserDeclined;

        setShowLocationDialog(shouldShowDialog);
    }, [permission, hasAskedPermission, hasUserDeclined]);

    // Auto-request location if permission is already granted
    useEffect(() => {
        if (
            permission === "granted" &&
            !position &&
            !loading &&
            !hasAskedPermission
        ) {
            requestLocation();
        }
    }, [permission, position, loading, hasAskedPermission, requestLocation]);

    const handleMapMove = (bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    }) => {
        setMapBounds(bounds);
        setShowSearchButton(true);
    };

    const handleLocationAccept = async () => {
        setShowLocationDialog(false);
        await requestLocation();
    };

    const handleLocationDecline = () => {
        setShowLocationDialog(false);
        setHasUserDeclined(true);
        setBooleanInStorage(STORAGE_KEYS.LOCATION_PERMISSION_DECLINED, true);
    };

    const handleMyLocationClick = async () => {
        if (position) {
            // If we already have location, just center on it
            setCenterOnLocation(true);
            setTimeout(() => setCenterOnLocation(false), 100);
        } else {
            // Request location permission and location
            await requestLocation();
        }
    };

    // Show error dialog if there's a location error
    const showErrorDialog = error && !hasUserDeclined;

    return (
        <>
            <Head title="Petrohaus" />

            <BackgroundMap
                gasStations={gasStations}
                userLocation={position}
                centerOnLocation={centerOnLocation}
                onMapMove={handleMapMove}
            />

            <SearchAreaButton
                bounds={mapBounds || undefined}
                visible={showSearchButton}
            />

            {/* My Location Button */}
            <MyLocationButton
                onLocationRequest={handleMyLocationClick}
                hasLocation={!!position}
                loading={loading}
                error={error}
                permission={permission}
            />

            {/* Location Permission Dialog */}
            <LocationPermissionDialog
                isOpen={showLocationDialog || !!showErrorDialog}
                onAccept={handleLocationAccept}
                onDecline={handleLocationDecline}
                error={error}
                loading={loading}
            />
        </>
    );
}
