<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Manifest Information
    |--------------------------------------------------------------------------
    |
    | See: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
    |
    */

    'name' => env('APP_NAME', 'Petrohaus'),

    'short_name' => env('APP_NAME', 'Petrohaus'),

    'description' => env(
        'APP_DESCRIPTION',
        'Petrohaus finds the best deals on petrol and diesel.',
    ),

    'start_url' => '/',

    'scope' => '/',

    'display' => 'minimal-ui',

    'background_color' => '#2F6DB6',

    'theme_color' => '#2F6DB6',

    'icons' => [
        [
            'src' => 'icon-192.png',
            'sizes' => '192x192',
            'type' => 'image/png',
        ],
        [
            'src' => 'icon-512.png',
            'sizes' => '512x512',
            'type' => 'image/png',
        ],
    ],

    'categories' => [
        'category' => 'category.png',
    ],

    'lang' => env('APP_LOCALE', 'en'),

    'dir' => 'ltr',

    'orientation' => 'portrait',
];
