<div class="w-full max-w-xs mx-auto my-4">
    <label for="product" class="block mb-2 text-sm font-medium text-gray-700">Select Product</label>
    <select
        id="product"
        class="select select-bordered w-full"
        wire:model="selectedProduct"
        wire:change="$emit('productSelected', selectedProduct)">
        <option value="">-- Choose a product --</option>
        @foreach ($products as $product)
        <option value="{{ $product->id }}" @selected($selectedProduct==$product->id)>
            {{ $product->name }}
        </option>
        @endforeach
    </select>
</div>