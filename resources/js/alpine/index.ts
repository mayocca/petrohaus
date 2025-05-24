import {
    Alpine,
    Livewire,
} from "../../../vendor/livewire/livewire/dist/livewire.esm";

window.Alpine = Alpine;

const data = import.meta.glob("./data/*.ts", {
    eager: true,
    import: "default",
});

for (const path in data) {
    const name = path.replace("./data/", "").replace(".ts", "");
    window.Alpine.data(name, data[path]);
}

Alpine.start();

Livewire.start();
