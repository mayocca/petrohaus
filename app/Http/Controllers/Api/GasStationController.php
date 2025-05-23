<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SearchGasStationsRequest;
use App\Modules\Dataset\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GasStationController extends Controller
{
    public function search(SearchGasStationsRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $companies = Company::query()
            ->select([
                'companies.id',
                'companies.name',
                'companies.address',
                'companies.city',
                'companies.province',
                'companies.latitude',
                'companies.longitude',
                'company_products.price',
                'company_products.validity_date',
                'franchises.name as franchise_name',
                'products.name as product_name'
            ])
            ->join('company_products', 'companies.id', '=', 'company_products.company_id')
            ->join('products', 'company_products.product_id', '=', 'products.id')
            ->join('franchises', 'companies.franchise_id', '=', 'franchises.id')
            ->where('company_products.product_id', $validated['product_id'])
            ->where('company_products.validity_date', '>=', now()->subWeek())
            ->whereNotNull('companies.latitude')
            ->whereNotNull('companies.longitude')
            ->whereBetween('companies.latitude', [
                $validated['bounds']['south'],
                $validated['bounds']['north']
            ])
            ->whereBetween('companies.longitude', [
                $validated['bounds']['west'],
                $validated['bounds']['east']
            ])
            ->orderBy('company_products.price', 'asc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $companies->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'franchise_name' => $company->franchise_name,
                    'address' => $company->address,
                    'city' => $company->city,
                    'province' => $company->province,
                    'latitude' => (float) $company->latitude,
                    'longitude' => (float) $company->longitude,
                    'price' => (float) $company->price,
                    'validity_date' => $company->validity_date,
                    'product_name' => $company->product_name,
                    'formatted_price' => '$' . number_format($company->price, 2, ',', '.'),
                ];
            }),
            'count' => $companies->count(),
        ]);
    }
}
