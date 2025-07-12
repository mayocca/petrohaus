import { MapPin, Navigation, Shield, AlertTriangle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LocationPermissionDialogProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
    error?: GeolocationPositionError | null;
    loading?: boolean;
}

export default function LocationPermissionDialog({
    isOpen,
    onAccept,
    onDecline,
    error,
    loading,
}: LocationPermissionDialogProps) {
    const getErrorMessage = (error: GeolocationPositionError) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return "Acceso a la ubicación denegado. Puedes habilitarlo en la configuración de tu navegador.";
            case error.POSITION_UNAVAILABLE:
                return "La información de ubicación no está disponible en este momento.";
            case error.TIMEOUT:
                return "La solicitud de ubicación ha caducado. Inténtalo nuevamente.";
            default:
                return "Ocurrió un error al acceder a tu ubicación.";
        }
    };

    if (error) {
        return (
            <AlertDialog open={isOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <AlertDialogTitle>
                                Error de Ubicación
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-left">
                            {getErrorMessage(error)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={onDecline}>
                            Continuar sin ubicación
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <AlertDialogTitle>
                            Acceder a tu ubicación
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-left space-y-3">
                        <p>
                            Petrohaus quiere acceder a tu ubicación para
                            ofrecerte una mejor experiencia:
                        </p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <Navigation className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>
                                    Mostrar estaciones de servicio cercanas a ti
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>
                                    Centrar el mapa en tu ubicación actual
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>
                                    Tu ubicación se mantiene privada y segura
                                </span>
                            </li>
                        </ul>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onDecline} disabled={loading}>
                        Usar sin ubicación
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onAccept} disabled={loading}>
                        {loading
                            ? "Obteniendo ubicación..."
                            : "Permitir ubicación"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
