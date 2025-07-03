<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Modules\Dataset\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Index', [
            'products' => Product::all(),
        ]);
    }
}
