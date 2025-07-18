<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Modules\Dataset\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $request->validate([
            'franchise_id' => ['sometimes', 'required', 'exists:franchises,id'],
            'product_id' => ['sometimes', 'required', 'exists:products,id'],
            'coordinates' => ['sometimes', 'required', 'array', 'size:2'],
            'coordinates.*' => ['array:latitude,longitude'],
            'coordinates.*.latitude' => ['required', 'numeric', 'between:-90,90'],
            'coordinates.*.longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $companies = Company::query()
            ->when(isset($data['franchise_id']), function (Builder $builder) use ($data) {
                $builder->where('franchise_id', $data['franchise_id']);
            })
            ->when(isset($data['product_id']), function (Builder $builder) use ($data) {
                $builder->whereHas('companyProducts', function (Builder $query) use ($data) {
                    $query->where('product_id', $data['product_id']);
                })
                    ->with([
                        'companyProducts' => function ($query) use ($data) {
                            $query->where('product_id', $data['product_id']);
                        },
                    ]);
            })
            ->when(isset($data['coordinates']), function (Builder $builder) use ($data) {
                $minLon = min(floatval($data['coordinates'][0]['longitude']), floatval($data['coordinates'][1]['longitude']));
                $minLat = min(floatval($data['coordinates'][0]['latitude']), floatval($data['coordinates'][1]['latitude']));
                $maxLon = max(floatval($data['coordinates'][0]['longitude']), floatval($data['coordinates'][1]['longitude']));
                $maxLat = max(floatval($data['coordinates'][0]['latitude']), floatval($data['coordinates'][1]['latitude']));

                $builder->whereRaw('location && ST_MakeEnvelope(?, ?, ?, ?)', [
                    $minLon,
                    $minLat,
                    $maxLon,
                    $maxLat,
                ]);
            })
            ->limit(10)
            ->get();

        return Inertia::render('Index', [
            'gasStations' => $companies,
        ]);
    }
}
