import { useCallback, useEffect } from "react";
import { useMap } from "../contexts/MapContext";

export function useMapActions() {
    const {
        selectedProduct,
        setSelectedProduct,
        searchGasStations,
        clearGasStations,
        setShowSearchButton,
        mapBounds,
        isSearching,
    } = useMap();

    const selectProduct = useCallback(
        (productId: number | null) => {
            setSelectedProduct(productId);

            if (productId) {
                // If there are map bounds available, search immediately
                if (mapBounds) {
                    searchGasStations();
                }
            } else {
                // Clear gas stations when no product is selected
                clearGasStations();
                setShowSearchButton(false);
            }
        },
        [
            mapBounds,
            searchGasStations,
            clearGasStations,
            setShowSearchButton,
            setSelectedProduct,
        ]
    );

    const handleMapMoved = useCallback(() => {
        if (selectedProduct && !isSearching) {
            setShowSearchButton(true);
        }
    }, [selectedProduct, isSearching, setShowSearchButton]);

    return {
        selectedProduct,
        selectProduct,
        handleMapMoved,
        searchGasStations,
        isSearching,
    };
}

export function useLocationTracking() {
    const { setUserLocation } = useMap();

    const handleLocationFound = useCallback(
        (latitude: number, longitude: number, accuracy: number) => {
            setUserLocation({ latitude, longitude, accuracy });
        },
        [setUserLocation]
    );

    const handleLocationError = useCallback(
        (error: GeolocationPositionError) => {
            console.warn("Location error:", error.message);
            setUserLocation(null);
        },
        [setUserLocation]
    );

    return {
        handleLocationFound,
        handleLocationError,
    };
}
