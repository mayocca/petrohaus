export interface Product {
    id: number;
    name: string;
}

export interface ProductPrice {
    product_name: string;
    day_price: string | null;
    night_price: string | null;
    validity_date: string;
}

export interface GasStation {
    id: number;
    name: string;
    franchise_name: string;
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    price: number;
    validity_date: string;
    product_name: string;
    formatted_price: string;
    schedule_type: string;
    prices: ProductPrice[];
}

export interface SearchBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface Filters {
    filter?: {
        product?: string;
        company?: string;
        franchise?: string;
        city?: string;
        province?: string;
    };
}
