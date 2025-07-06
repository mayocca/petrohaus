<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Enums;

enum ScheduleType: string
{
    case Day = 'day';
    case Night = 'night';
    case Unknown = 'unknown';

    public static function values(): array
    {
        return array_map(fn (ScheduleType $type) => $type->value, self::cases());
    }

    public static function fromDomainId(int $id): self
    {
        return match ($id) {
            2 => self::Day,
            3 => self::Night,
            default => self::Unknown,
        };
    }
}
