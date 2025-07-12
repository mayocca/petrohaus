<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Actions;

use App\Modules\Dataset\Messages\DatasetRow;
use Exception;
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

            $handle = fopen($url, 'r');

            if ($handle === false) {
                throw new Exception('Failed to open file');
            }

            try {
                if ($skipHeader) {
                    fgetcsv($handle, escape: '\\');
                }

                while (($line = fgetcsv($handle, escape: '\\')) !== false) {
                    yield $this->transformCsvRowToMessage->invoke($line);
                }
            } finally {
                // Handle is closed in finally block to ensure it is closed even if the stream is interrupted
                // or the stream is not fully read.
                fclose($handle);
            }
        });

        return $lazyCollection;
    }
}
