import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Product } from "../types";

interface ProductPopupProps {
    products: Product[];
    selectedProduct: number | null;
    onProductSelect: (productId: number | null) => void;
    onSearch: () => void;
    isSearching: boolean;
}

export default function ProductPopup({
    products,
    selectedProduct,
    onProductSelect,
    onSearch,
    isSearching,
}: ProductPopupProps) {
    return (
        <div className="fixed top-4 left-4 z-50 w-80">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Petrohaus</CardTitle>
                    <CardDescription>
                        Encuentra los mejores precios de combustible
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Tipo de combustible
                        </label>
                        <Select
                            value={selectedProduct?.toString() || ""}
                            onValueChange={(value) =>
                                onProductSelect(value ? parseInt(value) : null)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un combustible" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem
                                        key={product.id}
                                        value={product.id.toString()}
                                    >
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedProduct && (
                        <Button
                            onClick={onSearch}
                            disabled={isSearching}
                            className="w-full"
                            style={{ backgroundColor: "#2F6DB6" }}
                        >
                            {isSearching
                                ? "Buscando..."
                                : "Buscar en esta área"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
