<?php

namespace App\Modules\Dataset\Actions;

use App\Modules\Dataset\Messages\DatasetRow;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\LazyCollection;

readonly class FetchDatasetStreamIterator
{
    public function __construct(
        private DetermineDatasetUrl $determineDatasetUrl,
        private TransformCsvRowToMessage $transformCsvRowToMessage,
    ) {}

    /**
     * @return LazyCollection<int, DatasetRow>
     */
    public function invoke(
        ?string $url = null,
        bool $skipHeader = true,
    ): LazyCollection {
        /** @var LazyCollection<int, DatasetRow> $lazyCollection */
        $lazyCollection = LazyCollection::make(function () use ($url, $skipHeader) {
            $url ??= $this->determineDatasetUrl->invoke();

            Log::info('Fetching latest dataset', [
                'url' => $url,
            ]);

            $handle = fopen($url, 'r');

            if ($handle === false) {
                throw new Exception('Failed to open file');
            }

            if ($skipHeader) {
                fgetcsv($handle, escape: '\\');
            }

            while (($line = fgetcsv($handle, escape: '\\')) !== false) {
                yield $this->transformCsvRowToMessage->invoke($line);
            }

            fclose($handle);
        });

        return $lazyCollection;
    }
}
