import React from "react";
import { Head } from "@inertiajs/react";
import MapComponent from "../components/MapComponent";
import ProductSelector from "../components/ProductSelector";
import type { Product } from "../types";

interface IndexProps {
    products: Product[];
}

export default function Index({ products }: IndexProps) {
    return (
        <>
            <Head title="Petrohaus - Encuentra los mejores precios de combustible" />
            <div className="flex flex-col md:flex-row w-full h-full">
                <div
                    className="w-full md:w-1/4 z-10 p-4 md:p-6 shadow md:shadow-lg"
                    style={{ backgroundColor: "#2F6DB6" }}
                >
                    <ProductSelector products={products} />
                </div>
                <div className="flex-1 relative">
                    <MapComponent />
                </div>
            </div>
        </>
    );
}
