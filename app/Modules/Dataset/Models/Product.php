<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property non-empty-string $name
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 */
class Product extends Model
{
    protected $fillable = [
        'id',
        'name',
    ];

    public function companyProducts(): HasMany
    {
        return $this->hasMany(CompanyProduct::class);
    }
}
