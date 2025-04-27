<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Actions;

use App\Modules\Dataset\Messages\DatasetRow;
use App\Modules\Dataset\Models\Company;
use App\Modules\Dataset\Models\Franchise;
use Illuminate\Support\Facades\DB;

readonly class UpsertDataset
{
    /**
     * @param list<DatasetRow> $data
     */
    public function invoke(
        array $data,
        bool $withTransaction = true,
    ): void {
        if ($withTransaction) {
            DB::beginTransaction();
        }

        try {
            //
        } catch (\Exception $e) {
            if ($withTransaction) {
                DB::rollBack();
            }

            throw $e;
        }

        if ($withTransaction) {
            DB::commit();
        }
    }
}
