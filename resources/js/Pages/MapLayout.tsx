import { MapProvider } from "../contexts/MapContext";

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return <MapProvider>{children}</MapProvider>;
}
