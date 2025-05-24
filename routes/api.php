<?php

declare(strict_types=1);

use App\Http\Controllers\Api\GasStationController;
use Illuminate\Support\Facades\Route;

Route::post('gas-stations/search', [GasStationController::class, 'search'])
    ->name('gas-stations.search');
