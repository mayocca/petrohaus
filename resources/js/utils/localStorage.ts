export const STORAGE_KEYS = {
    LOCATION_PERMISSION_DECLINED: "petrohaus_location_declined",
    LOCATION_PERMISSION_ASKED: "petrohaus_location_asked",
} as const;

export function getStorageItem(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn("Error reading from localStorage:", error);
        return null;
    }
}

export function setStorageItem(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.warn("Error writing to localStorage:", error);
    }
}

export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn("Error removing from localStorage:", error);
    }
}

export function getBooleanFromStorage(
    key: string,
    defaultValue: boolean = false
): boolean {
    const value = getStorageItem(key);
    if (value === null) return defaultValue;
    return value === "true";
}

export function setBooleanInStorage(key: string, value: boolean): void {
    setStorageItem(key, value.toString());
}
