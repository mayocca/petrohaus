<?php

declare(strict_types=1);

namespace App\Modules\Manifest\Actions;

use App\Modules\Manifest\Data\Manifest;

class BuildApplicationManifest
{
    public function __construct(
        private Manifest $manifest,
    ) {}

    public function invoke(): string
    {
        return $this->manifest->toJson();
    }
}
