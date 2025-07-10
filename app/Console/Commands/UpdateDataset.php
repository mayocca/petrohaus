<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Dataset\Actions\DetermineDatasetUrl;
use App\Modules\Dataset\Actions\FetchDatasetStreamIterator;
use App\Modules\Dataset\Actions\UpsertDatasetRow;
use App\Modules\Dataset\Messages\DatasetRow;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

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

        $this->info('Fetching latest dataset from: '.$datasetUrl);

        $rows = $fetchDatasetStreamIterator->invoke($datasetUrl);

        try {
            DB::transaction(
                callback: function () use ($rows, $upsertDatasetRow) {
                    $this->info('Upserting dataset...');

                    $upserted = 0;

                    $this->withProgressBar(
                        $rows,
                        function (DatasetRow $datasetRow) use ($upsertDatasetRow, &$upserted): void {
                            $result = $upsertDatasetRow->invoke($datasetRow);

                            if ($result) {
                                $upserted++;
                            }
                        },
                    );

                    $this->info('Upserted '.$upserted.' row(s)');
                },
                attempts: 3,
            );
        } catch (Throwable $e) {
            Log::error('Failed to update dataset', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            $this->error('Failed to update dataset: '.$e->getMessage());
        }
    }
}
