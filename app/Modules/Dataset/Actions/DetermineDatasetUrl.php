<?php

declare(strict_types=1);

namespace App\Modules\Dataset\Actions;

use Illuminate\Contracts\Config\Repository;

readonly class DetermineDatasetUrl
{
    public function __construct(
        private Repository $repository,
    ) {}

    public function invoke(): string
    {
        return (string) $this->repository->get('services.dataset.fuel_prices.url');
    }
}
