<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::name('manifest')
    ->get('/manifest.json', function () {
        return response()->json(config('manifest'));
    });
