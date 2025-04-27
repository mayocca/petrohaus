<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Processes;

use App\Modules\Dataset\Actions\TransformCsvRowToMessage;
use App\Modules\Dataset\Actions\UpsertDataset;
use Illuminate\Support\LazyCollection;

readonly class UpdateDataset
{
    public function __construct(
        private readonly TransformCsvRowToMessage $transformCsvRowToMessage,
        private readonly UpsertDataset $upsertDataset,
    ) {}

    public function invoke(
        bool $skipHeader = true,
        bool $withTransaction = true,
    ): void {
        $rows = LazyCollection::make(function () use ($skipHeader) {
            $handle = fopen(config('services.dataset.fuel_prices.url'), 'r');

            if ($handle === false) {
                throw new \Exception('Failed to open file');
            }

            if ($skipHeader) {
                fgetcsv($handle, escape: '\\');
            }

            while (($line = fgetcsv($handle, escape: '\\')) !== false) {
                yield $this->transformCsvRowToMessage->invoke($line);
            }

            fclose($handle);
        });
    }
}
