<div class="w-full max-w-sm mx-auto">
    <div class="mb-4">
        <h3 class="text-lg font-semibold text-white mb-2">Seleccionar Combustible</h3>
        <p class="text-sm text-white/80">Encuentra las mejores ofertas cerca de ti</p>
    </div>
    
    <div class="space-y-2">
        <label for="product" class="block text-sm font-medium text-white">
            Tipo de combustible
        </label>
        <select
            id="product"
            class="select select-bordered w-full bg-white text-gray-900 focus:border-white"
            wire:model="selectedProduct">
            <option value="" disabled selected>Selecciona un combustible</option>
            @forelse ($products as $product)
            <option value="{{ $product->id }}">{{ $product->name }}</option>
            @empty
            <option disabled>No hay productos disponibles</option>
            @endforelse
        </select>
    </div>
    
    @if($selectedProduct)
    <div class="mt-4 p-3 bg-white/10 border border-white/20 rounded-btn">
        <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span class="text-sm text-white font-medium">
                Buscando mejores precios...
            </span>
        </div>
    </div>
    @endif
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    Livewire.on('product-selected', function(productId) {
        window.dispatchEvent(new CustomEvent('productSelected', {
            detail: productId
        }));
    });
});
</script>