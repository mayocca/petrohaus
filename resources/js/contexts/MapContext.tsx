import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { GasStation } from "../types";

export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface MapContextType {
    // State
    selectedProduct: number | null;
    gasStations: GasStation[];
    userLocation: UserLocation | null;
    isSearching: boolean;
    showSearchButton: boolean;
    mapBounds: MapBounds | null;

    // Actions
    setSelectedProduct: (productId: number | null) => void;
    setGasStations: (stations: GasStation[]) => void;
    setUserLocation: (location: UserLocation | null) => void;
    setIsSearching: (isSearching: boolean) => void;
    setShowSearchButton: (show: boolean) => void;
    setMapBounds: (bounds: MapBounds | null) => void;
    searchGasStations: () => Promise<void>;
    clearGasStations: () => void;
}

const MapContext = createContext<MapContextType | null>(null);

export interface MapProviderProps {
    children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [gasStations, setGasStations] = useState<GasStation[]>([]);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchButton, setShowSearchButton] = useState(false);
    const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

    const searchGasStations = useCallback(async () => {
        if (!selectedProduct || !mapBounds) return;

        setIsSearching(true);
        setShowSearchButton(false);

        try {
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
                    bounds: mapBounds,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al buscar estaciones de servicio");
            }

            const data = await response.json();

            if (data.success) {
                setGasStations(data.data);
            }
        } catch (error) {
            console.error("Error searching gas stations:", error);
        } finally {
            setIsSearching(false);
        }
    }, [selectedProduct, mapBounds]);

    const clearGasStations = useCallback(() => {
        setGasStations([]);
    }, []);

    const value: MapContextType = {
        selectedProduct,
        gasStations,
        userLocation,
        isSearching,
        showSearchButton,
        mapBounds,
        setSelectedProduct,
        setGasStations,
        setUserLocation,
        setIsSearching,
        setShowSearchButton,
        setMapBounds,
        searchGasStations,
        clearGasStations,
    };

    return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap(): MapContextType {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
}
