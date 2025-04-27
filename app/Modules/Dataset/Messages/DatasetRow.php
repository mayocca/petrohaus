<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Messages;

use DateTimeImmutable;

readonly class DatasetRow
{
    /**
     * @param non-empty-string $timeIndex
     * @param positive-int $companyId
     * @param non-empty-string $cuit
     * @param non-empty-string $companyName
     * @param non-empty-string $address
     * @param non-empty-string $city
     * @param non-empty-string $province
     * @param non-empty-string|null $region
     * @param positive-int $productId
     * @param non-empty-string $productName
     * @param positive-int $scheduleId
     * @param non-empty-string $scheduleName
     * @param positive-float $price
     * @param DateTimeImmutable $validityDate
     * @param positive-int $franchiseId
     * @param non-empty-string $franchiseName
     * @param positive-float|null $latitude
     * @param positive-float|null $longitude
     * @param non-empty-string|null $geoJson
     */
    public function __construct(
        public string $timeIndex,
        public int $companyId,
        public string $cuit,
        public string $companyName,
        public string $address,
        public string $city,
        public string $province,
        public ?string $region,
        public int $productId,
        public string $productName,
        public int $scheduleId,
        public string $scheduleName,
        public float $price,
        public DateTimeImmutable $validityDate,
        public int $franchiseId,
        public string $franchiseName,
        public ?float $latitude,
        public ?float $longitude,
        public ?string $geoJson,
    ) {}
}
