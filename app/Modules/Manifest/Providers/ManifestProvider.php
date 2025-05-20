<?php

declare(strict_types=1);

namespace App\Modules\Manifest\Providers;

use App\Modules\Manifest\Actions\BuildApplicationManifest;
use Illuminate\Support\ServiceProvider;

class ManifestProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(BuildApplicationManifest::class, BuildApplicationManifest::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__.'/../Routes/web.php');
    }
}
