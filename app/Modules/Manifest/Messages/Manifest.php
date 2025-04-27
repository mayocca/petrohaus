<?php

declare(strict_types=1);

namespace App\Modules\Manifest\Messages;

use Illuminate\Contracts\Support\Jsonable;

readonly class Manifest implements Jsonable
{
    public const SCHEMA = 'https://json.schemastore.org/web-manifest-combined.json';

    public function toJson($options = 0)
    {
        return json_encode(
            value: array_merge(
                config('manifest'),
                [
                    'schema' => self::SCHEMA,
                ]
            ),
            flags: $options,
        );
    }
}
