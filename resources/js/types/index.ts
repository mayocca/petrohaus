export interface Product {
    id: number;
    name: string;
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
}

export interface SearchBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}
