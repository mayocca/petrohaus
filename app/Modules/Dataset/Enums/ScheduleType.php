<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Enums;

use InvalidArgumentException;

enum ScheduleType: string
{
    case Day = 'day';
    case Night = 'night';

    public static function values(): array
    {
        return array_map(fn(ScheduleType $type) => $type->value, self::cases());
    }

    public static function fromDomainId(int $id): self
    {
        return match ($id) {
            1 => self::Day,
            2 => self::Night,
            default => throw new InvalidArgumentException("Invalid schedule type ID: {$id}"),
        };
    }
}
