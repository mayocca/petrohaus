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
        Schema::create('company_products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')->constrained('companies');
            $table->foreignId('product_id')->constrained('products');

            $table->float('price');
            $table->enum('schedule_type', ['day', 'night']);

            $table->timestamp('validity_date')->nullable();

            $table->timestamps();

            $table->unique(['company_id', 'product_id', 'schedule_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_products');
    }
};
