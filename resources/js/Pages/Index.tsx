import { Head, usePage } from "@inertiajs/react";
import BackgroundMap from "../components/Map/BackgroundMap";
import ProductSelector from "../components/ProductSelector";
import type { Product } from "../types";
import MapLayout from "./MapLayout";
import { useMapActions } from "@/hooks/useMapActions";

interface IndexProps {
    products: Product[];
    filters: Record<string, string>;
}

const Index = ({ products }: IndexProps) => {
    const page = usePage();
    const queryParams = new URLSearchParams(page.url.split("?")[1]);
    const filters = Object.fromEntries(queryParams.entries());
    const { selectProduct } = useMapActions();
    selectProduct(Number(filters["filter[product]"]));
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
                    <BackgroundMap />
                </div>
            </div>
        </>
    );
};

Index.layout = (page: React.ReactNode) => <MapLayout children={page} />;

export default Index;
