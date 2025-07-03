import { useState } from "react";
import type { Product } from "../types";

interface ProductSelectorProps {
    products: Product[];
    onProductSelected?: (productId: number | null) => void;
}

export default function ProductSelector({
    products,
    onProductSelected,
}: ProductSelectorProps) {
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

    const handleProductChange = (productId: number | null) => {
        setSelectedProduct(productId);
        onProductSelected?.(productId);

        // Dispatch custom event for map component
        window.dispatchEvent(
            new CustomEvent("productSelected", {
                detail: productId,
            })
        );
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                    Seleccionar Combustible
                </h3>
                <p className="text-sm text-white/80">
                    Encuentra las mejores ofertas cerca de ti
                </p>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="product"
                    className="block text-sm font-medium text-white"
                >
                    Tipo de combustible
                </label>
                <select
                    id="product"
                    className="select select-bordered w-full bg-white text-gray-900 focus:border-white"
                    value={selectedProduct || ""}
                    onChange={(e) =>
                        handleProductChange(
                            e.target.value ? parseInt(e.target.value) : null
                        )
                    }
                >
                    <option value="" disabled>
                        Selecciona un combustible
                    </option>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No hay productos disponibles</option>
                    )}
                </select>
            </div>

            {selectedProduct && (
                <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-btn">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm text-white font-medium">
                            Buscando mejores precios...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
