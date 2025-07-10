<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Actions;

use App\Modules\Dataset\Enums\ScheduleType;
use App\Modules\Dataset\Messages\DatasetRow;
use App\Modules\Dataset\Models\Company;
use App\Modules\Dataset\Models\CompanyProduct;
use App\Modules\Dataset\Models\Franchise;
use App\Modules\Dataset\Models\Product;
use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Support\Facades\Log;

readonly class UpsertDatasetRow
{
    public function invoke(DatasetRow $datasetRow): bool
    {
        $newestEntry = CompanyProduct::query()
            ->where('company_id', $datasetRow->companyId)
            ->where('product_id', $datasetRow->productId)
            ->where('schedule_type', ScheduleType::fromDomainId($datasetRow->scheduleId))
            ->latest('validity_date')
            ->first();

        if ($newestEntry && $newestEntry->validity_date >= $datasetRow->validityDate) {
            // Skip upsert for this row because it's older than the newest entry
            return false;
        }

        Franchise::query()
            ->upsert(
                values: [
                    'id' => $datasetRow->franchiseId,
                    'name' => $datasetRow->franchiseName,
                ],
                uniqueBy: ['id'],
                update: ['name'],
            );

        Company::query()
            ->upsert(
                values: [
                    'id' => $datasetRow->companyId,
                    'franchise_id' => $datasetRow->franchiseId,
                    'cuit' => $datasetRow->cuit,
                    'name' => $datasetRow->companyName,
                    'address' => $datasetRow->address,
                    'city' => $datasetRow->city,
                    'province' => $datasetRow->province,
                    'region' => $datasetRow->region,
                    'location' => Point::makeGeodetic(
                        latitude: $datasetRow->latitude,
                        longitude: $datasetRow->longitude,
                    ),
                ],
                uniqueBy: ['id'],
                update: ['franchise_id', 'cuit', 'name', 'address', 'city', 'province', 'region', 'location'],
            );

        Product::query()
            ->upsert(
                values: [
                    'id' => $datasetRow->productId,
                    'name' => $datasetRow->productName,
                ],
                uniqueBy: ['id'],
                update: ['name'],
            );

        CompanyProduct::query()
            ->upsert(
                values: [
                    'company_id' => $datasetRow->companyId,
                    'product_id' => $datasetRow->productId,
                    'schedule_type' => $scheduleType = ScheduleType::fromDomainId($datasetRow->scheduleId),
                    'price' => $datasetRow->price,
                    'validity_date' => $datasetRow->validityDate,
                ],
                uniqueBy: ['company_id', 'product_id', 'schedule_type'],
                update: ['price', 'validity_date'],
            );

        if ($scheduleType === ScheduleType::Unknown) {
            Log::warning('Unknown schedule type', [
                'schedule_type' => $scheduleType,
                'schedule_id' => $datasetRow->scheduleId,
            ]);
        }

        return true;
    }
}
