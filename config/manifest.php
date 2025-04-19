<?php

declare(strict_types=1);

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Application Information
    |--------------------------------------------------------------------------
    |
    | This is the information about the application.
    |
    */

    'id' => env('APP_ID', Str::slug(env('APP_NAME', 'Laravel'))),

    'name' => env('APP_NAME', 'Laravel'),

    'short_name' => env('APP_NAME', 'Laravel'),

    'start_url' => '/',

    'display' => 'standalone',

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
];
