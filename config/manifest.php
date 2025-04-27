<?php

declare(strict_types=1);

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Manifest Information
    |--------------------------------------------------------------------------
    |
    | See: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest
    |
    */

    'id' => env('APP_ID', Str::slug(env('APP_NAME', 'Petrohaus'))),

    'name' => env('APP_NAME', 'Petrohaus'),

    'short_name' => env('APP_NAME', 'Petrohaus'),

    'description' => env(
        'APP_DESCRIPTION',
        'Petrohaus finds the best deals on petrol and diesel.',
    ),

    'start_url' => '/',

    'scope' => '/',

    'display' => 'minimal-ui',

    'background_color' => '#000000',

    'theme_color' => '#000000',

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

    'screenshots' => [
        [
            'src' => 'icon-512.png',
            'sizes' => '512x512',
            'type' => 'image/png',
            'form_factor' => 'narrow',
        ],
        [
            'src' => 'icon-512.png',
            'sizes' => '512x512',
            'type' => 'image/png',
            'form_factor' => 'wide',
        ],
    ],

    'lang' => env('APP_LOCALE', 'en'),

    'dir' => 'ltr',

    'orientation' => 'portrait',
];
