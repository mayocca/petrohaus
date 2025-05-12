<?php

namespace App\Console\Commands;

use App\Modules\Dataset\Actions\DetermineDatasetUrl;
use App\Modules\Dataset\Actions\FetchDatasetStreamIterator;
use App\Modules\Dataset\Actions\UpsertDatasetEntry;
use App\Modules\Dataset\Messages\DatasetRow;
use App\Modules\Dataset\Processes\FetchLatestDataset;
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
        DetermineDatasetUrl        $determineDatasetUrl,
        FetchDatasetStreamIterator $fetchDatasetStreamIterator,
        UpsertDatasetEntry         $upsertDatasetEntry,
    ): void
    {
        $datasetUrl = $determineDatasetUrl->invoke();

        $this->info('Fetching latest dataset from: ' . $datasetUrl);

        $rows = $fetchDatasetStreamIterator->invoke($datasetUrl);

        DB::transaction(
            callback: function () use ($rows, $upsertDatasetEntry) {
                $this->info('Upserting dataset...');

                $this->withProgressBar(
                    $rows,
                    function (DatasetRow $datasetRow) use ($upsertDatasetEntry): void {
                        $upsertDatasetEntry->invoke($datasetRow);
                    },
                );
            },
            attempts: 3,
        );

    }
}
