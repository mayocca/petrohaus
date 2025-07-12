import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GasStation } from "../types";

interface CompanyListProps {
    gasStations: GasStation[];
    isVisible: boolean;
    onClose: () => void;
}

export default function CompanyList({
    gasStations,
    isVisible,
    onClose,
}: CompanyListProps) {
    if (!isVisible || gasStations.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg">
                                Resultados
                            </CardTitle>
                            <CardDescription>
                                {gasStations.length} estaciones encontradas
                            </CardDescription>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {gasStations.map((station, index) => (
                        <div
                            key={`${station.id}-${index}`}
                            className="border rounded-lg p-3 space-y-2"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4
                                        className="font-semibold text-sm"
                                        style={{ color: "#2F6DB6" }}
                                    >
                                        {station.franchise_name}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        {station.name}
                                    </p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="text-xs"
                                    style={{
                                        backgroundColor: "#2F6DB6",
                                        color: "white",
                                    }}
                                >
                                    #{index + 1}
                                </Badge>
                            </div>

                            <p className="text-xs text-gray-500">
                                {station.address}, {station.city}
                            </p>

                            <div className="space-y-2">
                                {station.prices.map(
                                    (productPrice, priceIndex) => (
                                        <div
                                            key={priceIndex}
                                            className="bg-blue-50 p-2 rounded border-l-4 border-blue-500"
                                        >
                                            <p className="text-xs font-medium mb-1">
                                                {productPrice.product_name}
                                            </p>

                                            <div className="flex justify-between items-center">
                                                <div className="space-y-1">
                                                    {productPrice.day_price && (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-gray-600">
                                                                ☀️ Día:
                                                            </span>
                                                            <span
                                                                className="text-sm font-bold"
                                                                style={{
                                                                    color: "#2F6DB6",
                                                                }}
                                                            >
                                                                {
                                                                    productPrice.day_price
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {productPrice.night_price && (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs text-gray-600">
                                                                🌙 Noche:
                                                            </span>
                                                            <span
                                                                className="text-sm font-bold"
                                                                style={{
                                                                    color: "#2F6DB6",
                                                                }}
                                                            >
                                                                {
                                                                    productPrice.night_price
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Actualizado:{" "}
                                                {new Date(
                                                    productPrice.validity_date
                                                ).toLocaleDateString("es-AR")}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
