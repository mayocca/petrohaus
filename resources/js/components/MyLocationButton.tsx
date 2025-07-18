import { MapPin, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MyLocationButtonProps {
    className?: string;
    onLocationRequest: () => void;
    hasLocation: boolean;
    loading: boolean;
    error: GeolocationPositionError | null;
    permission: PermissionState | null;
}

export default function MyLocationButton({
    className,
    onLocationRequest,
    hasLocation,
    loading,
    error,
    permission,
}: MyLocationButtonProps) {
    // Only show the button if permission is granted
    if (permission !== "granted") {
        return null;
    }

    const getButtonVariant = () => {
        if (error) return "destructive";
        if (hasLocation) return "default";
        return "outline";
    };

    const getButtonText = () => {
        if (loading) return "Obteniendo ubicación...";
        if (error) return "Error de ubicación";
        if (hasLocation) return "Mi ubicación";
        return "Usar mi ubicación";
    };

    const getIcon = () => {
        if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
        return <MapPin className="w-4 h-4" />;
    };

    return (
        <Button
            variant={getButtonVariant()}
            size="sm"
            className={cn(
                "fixed bottom-20 right-4 z-[1000] shadow-lg",
                className
            )}
            onClick={onLocationRequest}
            disabled={loading}
        >
            {getIcon()}
            <span className="ml-2">{getButtonText()}</span>
        </Button>
    );
}
