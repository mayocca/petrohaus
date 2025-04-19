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

    'id' => env('APP_ID', Str::slug(env('APP_NAME', 'Laravel'))),

    'name' => env('APP_NAME', 'Laravel'),

    'short_name' => env('APP_NAME', 'Laravel'),

    'description' => env(
        'APP_DESCRIPTION',
        'Pets.net is a social network for pet owners.',
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
