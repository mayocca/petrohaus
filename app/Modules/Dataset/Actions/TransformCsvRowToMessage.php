<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Actions;

use App\Modules\Dataset\Messages\DatasetRow;
use App\Utils\Str;
use DateTimeImmutable;

readonly class TransformCsvRowToMessage
{
    public function invoke(
        array $data,
    ): DatasetRow {
        return new DatasetRow(
            timeIndex: $data[0],
            companyId: (int) $data[1],
            cuit: $data[2],
            companyName: $data[3],
            address: $data[4],
            city: $data[5],
            province: $data[6],
            region: Str::nonEmptyOrNull($data[7]),
            productId: (int) $data[8],
            productName: $data[9],
            scheduleId: (int) $data[10],
            scheduleName: $data[11],
            price: (float) $data[12],
            validityDate: new DateTimeImmutable($data[13]),
            franchiseId: (int) $data[14],
            franchiseName: $data[15],
            latitude: (float) Str::nonEmptyOrNull($data[16]),
            longitude: (float) Str::nonEmptyOrNull($data[17]),
            geoJson: Str::nonEmptyOrNull($data[18]),
        );
    }
}
