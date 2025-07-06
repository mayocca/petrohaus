import React, { useState, useCallback } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import SimpleMap from "../components/SimpleMap";
import ProductPopup from "../components/ProductPopup";
import CompanyList from "../components/CompanyList";
import type { Product, GasStation } from "../types";

interface IndexProps {
    products: Product[];
    gasStations: GasStation[];
}

export default function Index({ products, gasStations }: IndexProps) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split("?")[1] || "");
    const productFilter = urlParams.get("filter[product]");

    const [selectedProduct, setSelectedProduct] = useState<number | null>(
        productFilter ? parseInt(productFilter) : null
    );
    const [showResults, setShowResults] = useState(gasStations.length > 0);

    const handleProductSelect = useCallback((productId: number | null) => {
        setSelectedProduct(productId);

        if (productId) {
            // Use Inertia router to update URL with filter
            router.get(
                "/",
                {
                    filter: {
                        product: productId.toString(),
                    },
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ["gasStations"],
                }
            );
        } else {
            // Clear filters
            router.get(
                "/",
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ["gasStations"],
                }
            );
            setShowResults(false);
        }
    }, []);

    const handleSearch = useCallback(() => {
        if (!selectedProduct) return;

        // Trigger a fresh search with current filters
        router.get(
            "/",
            {
                filter: {
                    product: selectedProduct.toString(),
                },
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["gasStations"],
            }
        );

        setShowResults(true);
    }, [selectedProduct]);

    const handleCloseResults = useCallback(() => {
        setShowResults(false);
    }, []);

    // Update show results when gasStations change
    React.useEffect(() => {
        setShowResults(gasStations.length > 0);
    }, [gasStations]);

    // Update selected product when URL changes
    React.useEffect(() => {
        const currentProductFilter = urlParams.get("filter[product]");
        const currentProduct = currentProductFilter
            ? parseInt(currentProductFilter)
            : null;
        setSelectedProduct(currentProduct);
    }, [url]);

    return (
        <>
            <Head title="Petrohaus - Encuentra los mejores precios de combustible" />

            <div className="relative w-full h-screen">
                <SimpleMap gasStations={gasStations} />

                <ProductPopup
                    products={products}
                    selectedProduct={selectedProduct}
                    onProductSelect={handleProductSelect}
                    onSearch={handleSearch}
                    isSearching={false}
                />

                <CompanyList
                    gasStations={gasStations}
                    isVisible={showResults}
                    onClose={handleCloseResults}
                />
            </div>
        </>
    );
}
