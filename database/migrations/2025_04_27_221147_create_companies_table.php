<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            $table->foreignId('franchise_id')->constrained('franchises');

            $table->string('name');
            $table->string('cuit');
            $table->string('address');
            $table->string('city');
            $table->string('province');
            $table->string('region')->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();

            $table->timestamps();

            $table->index('longitude');
            $table->index('latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
