import { Head } from "@inertiajs/react";
import Map from "../components/Map";
import type { GasStation } from "../types";

interface IndexProps {
    gasStations: GasStation[];
}

export default function Index({ gasStations }: IndexProps) {
    return (
        <>
            <Head title="Petrohaus" />

            <div className="relative w-full h-screen">
                <Map gasStations={gasStations} />

                {/* <ProductPopup
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
                /> */}
            </div>
        </>
    );
}
