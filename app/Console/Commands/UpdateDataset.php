<?php

namespace App\Console\Commands;

use App\Modules\Dataset\Actions\DetermineDatasetUrl;
use App\Modules\Dataset\Actions\FetchDatasetStreamIterator;
use App\Modules\Dataset\Actions\UpsertDatasetRow;
use App\Modules\Dataset\Messages\DatasetRow;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;
use Illuminate\Support\Facades\DB;

class UpdateDataset extends Command implements Isolatable
{
    /**
     * @var string
     */
    protected $signature = 'app:update-dataset';

    /**
     * @var string
     */
    protected $description = 'Fetch and update the latest dataset';

    /**
     * Execute the console command.
     */
    public function handle(
        DetermineDatasetUrl $determineDatasetUrl,
        FetchDatasetStreamIterator $fetchDatasetStreamIterator,
        UpsertDatasetRow $upsertDatasetRow,
    ): void {
        $datasetUrl = $determineDatasetUrl->invoke();

        $this->info('Fetching latest dataset from: ' . $datasetUrl);

        $rows = $fetchDatasetStreamIterator->invoke($datasetUrl);

        DB::transaction(
            callback: function () use ($rows, $upsertDatasetRow) {
                $this->info('Upserting dataset...');

                $this->withProgressBar(
                    $rows,
                    function (DatasetRow $datasetRow) use ($upsertDatasetRow): void {
                        $upsertDatasetRow->invoke($datasetRow);
                    },
                );
            },
            attempts: 3,
        );
    }
}
