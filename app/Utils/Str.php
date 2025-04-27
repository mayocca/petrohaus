<?php

declare(strict_types=1);

namespace App\Utils;

use Illuminate\Support\Str as BaseStr;

class Str extends BaseStr
{
    /**
     * Returns a non-empty string or null.
     *
     * @param  string|null  $string
     * @return non-empty-string|null
     */
    public static function nonEmptyOrNull(?string $string): string|null
    {
        return $string === '' ? null : $string;
    }
}
