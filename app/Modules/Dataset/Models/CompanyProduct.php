<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Models;

use App\Modules\Dataset\Enums\ScheduleType;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Carbon;

/**
 * @property int $company_id
 * @property int $product_id
 * @property ScheduleType $schedule_type
 * @property float $price
 * @property-read Company $company
 * @property-read Product $product
 * @property-read Carbon $updated_at
 */
class CompanyProduct extends Pivot
{
    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'product_id',
        'schedule_type',
        'price',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'schedule_type' => ScheduleType::class,
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
