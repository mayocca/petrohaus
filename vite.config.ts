import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import manifestSRI from "vite-plugin-manifest-sri";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.tsx"],
            refresh: ["resources/js/**/*", "resources/views/**/*"],
        }),
        tailwindcss(),
        manifestSRI(),
    ],
    resolve: {
        alias: {
            "@": "/resources/js",
        },
    },
    server: {
        cors: true,
    },
});
