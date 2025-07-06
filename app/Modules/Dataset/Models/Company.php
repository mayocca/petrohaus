<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Models;

use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $franchise_id
 * @property non-empty-string $name
 * @property non-empty-string $cuit
 * @property non-empty-string $address
 * @property non-empty-string $city
 * @property non-empty-string $province
 * @property non-empty-string|null $region
 * @property Point|null $location
 * @property-read Franchise $franchise
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<int, CompanyProduct> $companyProducts
 */
class Company extends Model
{
    protected $fillable = [
        'id',
        'franchise_id',
        'name',
        'cuit',
        'address',
        'city',
        'province',
        'region',
        'location',
    ];

    protected function casts(): array
    {
        return [
            'location' => Point::class,
        ];
    }

    public function franchise(): BelongsTo
    {
        return $this->belongsTo(Franchise::class);
    }

    public function companyProducts(): HasMany
    {
        return $this->hasMany(CompanyProduct::class);
    }
}
