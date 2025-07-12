import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";

/**
 * A button that allows the user to search gas stations in the current map view.
 *
 * @returns A button that allows the user to search for a gas station by area.
 */
export default function SearchAreaButton({
    className,
    bounds,
    visible = false,
}: {
    className?: string;
    bounds?: { north: number; south: number; east: number; west: number };
    visible?: boolean;
}) {
    const handleSearch = () => {
        if (!bounds) return;

        // Format coordinates as expected by the HomeController
        const coordinates = [
            { latitude: bounds.south, longitude: bounds.west },
            { latitude: bounds.north, longitude: bounds.east },
        ];

        // Navigate to the current page with the coordinates as query parameters
        // This will update the URL and reload only the gasStations data
        router.get(
            window.location.pathname,
            {
                coordinates,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["gasStations"],
            }
        );
    };

    if (!visible) return null;

    return (
        <Button
            variant="outline"
            size="default"
            className={cn(
                "fixed top-4 right-4 z-[1000] bg-white shadow-lg border-gray-300",
                className
            )}
            onClick={handleSearch}
        >
            <Search className="w-4 h-4 mr-2" />
            Buscar en esta área
        </Button>
    );
}
