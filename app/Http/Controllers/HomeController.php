<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Modules\Dataset\Models\Company;
use Clickbar\Magellan\Data\Boxes\Box2D;
use Clickbar\Magellan\Database\PostgisFunctions\ST;
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
                        'companyProducts' => function (Builder $query) use ($data) {
                            $query->where('product_id', $data['product_id']);
                        },
                    ]);
            })
            ->when(isset($data['coordinates']), function (Builder $builder) use ($data) {
                $builder->whereHas('location', function (Builder $query) use ($data) {
                    // Filter companies that are within the bounding box of the provided coordinates
                    $box = Box2D::make(
                        xMin: min($data['coordinates'][0]['longitude'], $data['coordinates'][1]['longitude']),
                        yMin: min($data['coordinates'][0]['latitude'], $data['coordinates'][1]['latitude']),
                        xMax: max($data['coordinates'][0]['longitude'], $data['coordinates'][1]['longitude']),
                        yMax: max($data['coordinates'][0]['latitude'], $data['coordinates'][1]['latitude']),
                    );

                    $query->where(ST::intersects('location', $box));
                });
            })
            ->limit(10)
            ->get();

        // debug($companies->jsonSerialize());
        // return response()->json($data);
        // return response()->json($companies);
        debug($companies->jsonSerialize());

        return Inertia::render('Home', [
            'companies' => $companies,
        ]);
    }
}
