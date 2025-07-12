import { useState, useEffect, useCallback } from "react";

export interface LocationState {
    position: GeolocationPosition | null;
    error: GeolocationPositionError | null;
    loading: boolean;
    permission: PermissionState | null;
    hasAskedPermission: boolean;
}

export interface UseLocationPermissionReturn extends LocationState {
    requestLocation: () => Promise<void>;
    checkPermission: () => Promise<PermissionState>;
    resetPermission: () => void;
}

export function useLocationPermission(): UseLocationPermissionReturn {
    const [state, setState] = useState<LocationState>({
        position: null,
        error: null,
        loading: false,
        permission: null,
        hasAskedPermission: false,
    });

    const checkPermission = useCallback(async (): Promise<PermissionState> => {
        if (!navigator.permissions) {
            // Fallback for browsers that don't support permissions API
            return "prompt";
        }

        try {
            const result = await navigator.permissions.query({
                name: "geolocation",
            });
            setState((prev) => ({ ...prev, permission: result.state }));
            return result.state;
        } catch (error) {
            console.warn("Error checking geolocation permission:", error);
            return "prompt";
        }
    }, []);

    const requestLocation = useCallback(async (): Promise<void> => {
        if (!navigator.geolocation) {
            setState((prev) => ({
                ...prev,
                error: {
                    code: 0,
                    message: "Geolocation is not supported by this browser.",
                } as GeolocationPositionError,
                loading: false,
            }));
            return;
        }

        setState((prev) => ({
            ...prev,
            loading: true,
            error: null,
            hasAskedPermission: true,
        }));

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
        };

        try {
            const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        options
                    );
                }
            );

            setState((prev) => ({
                ...prev,
                position,
                loading: false,
                error: null,
            }));

            // Update permission state after successful request
            await checkPermission();
        } catch (error) {
            setState((prev) => ({
                ...prev,
                error: error as GeolocationPositionError,
                loading: false,
            }));

            // Update permission state after failed request
            await checkPermission();
        }
    }, [checkPermission]);

    const resetPermission = useCallback(() => {
        setState({
            position: null,
            error: null,
            loading: false,
            permission: null,
            hasAskedPermission: false,
        });
    }, []);

    // Check permission on mount
    useEffect(() => {
        checkPermission();
    }, [checkPermission]);

    return {
        ...state,
        requestLocation,
        checkPermission,
        resetPermission,
    };
}
