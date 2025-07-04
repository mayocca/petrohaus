<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Modules\Dataset\Models\Company;
use App\Modules\Dataset\Models\Product;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class HomeController extends Controller
{
    public function index(): Response
    {
        $companies = QueryBuilder::for(Company::class)
            ->allowedFilters([
                AllowedFilter::exact('product', 'companyProducts.product_id'),
            ])
            ->limit(20)
            ->get();

        debug($companies);

        return Inertia::render('Index', [
            'companies' => $companies,
            'products' => Product::all(),
        ]);
    }
}
