<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Models;

use App\Modules\Dataset\Enums\ScheduleType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $company_id
 * @property int $product_id
 * @property ScheduleType $schedule_type
 * @property float $price
 * @property Carbon $validity_date
 * @property-read Company $company
 * @property-read Product $product
 * @property-read Carbon $updated_at
 */
class CompanyProduct extends Model
{
    protected $table = 'company_products';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'product_id',
        'schedule_type',
        'price',
        'validity_date',
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
