<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Modules\Dataset\Actions\FetchDatasetStreamIterator;
use App\Modules\Dataset\Actions\UpsertDatasetRow;
use App\Modules\Dataset\Messages\DatasetRow;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PriceSeeder extends Seeder
{
    private const ROWS_COUNT = 1000;

    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(
        FetchDatasetStreamIterator $fetchDatasetStreamIterator,
        UpsertDatasetRow $upsertDatasetRow,
    ): void {
        $rows = $fetchDatasetStreamIterator
            ->invoke(
                url: base_path('tests/Data/dataset.csv'),
            )
            ->take(self::ROWS_COUNT);

        $this->command->info(sprintf('Seeding %s prices...', $rows->count()));

        $this->command->withProgressBar(
            $rows,
            function (DatasetRow $datasetRow) use ($upsertDatasetRow) {
                $upsertDatasetRow->invoke($datasetRow);
            },
        );

        $this->command->info('Seeded prices');
    }
}
